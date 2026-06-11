from datetime import datetime, timedelta, timezone
from typing import Optional, List
import uuid

import MetaTrader5 as mt5
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class TradeRequest(BaseModel):
    symbol: str
    action: str
    volume: float
    stopLoss: Optional[float] = None
    takeProfit: Optional[float] = None
    comment: Optional[str] = None

class ModifyPositionRequest(BaseModel):
    stopLoss: Optional[float] = None
    takeProfit: Optional[float] = None

class PositionResponse(BaseModel):
    ticket: int
    symbol: str
    type: str
    volume: float
    open_price: float
    current_price: float
    profit: float
    swap: float
    commission: float
    stop_loss: Optional[float]
    take_profit: Optional[float]
    open_time: datetime

class AccountResponse(BaseModel):
    balance: float
    equity: float
    margin: float
    margin_free: float
    margin_level: float
    currency: str
    leverage: int

class TradeHistoryItem(BaseModel):
    ticket: int
    symbol: str
    type: str
    volume: float
    price: float
    time: datetime
    profit: float
    commission: float
    swap: float
    order: int
    position_id: int

LOCAL_MAGIC = 234000
current_session_id: Optional[str] = None
current_session_login: Optional[int] = None
current_session_server: Optional[str] = None
is_connected = False


def init_mt5() -> None:
    if not mt5.initialize():
        raise RuntimeError(f"Unable to initialize MT5: {mt5.last_error()}")


def sync_session_state():
    global current_session_id, current_session_login, current_session_server, is_connected
    account_info = mt5.account_info()

    if account_info is None:
        current_session_id = None
        current_session_login = None
        current_session_server = None
        is_connected = False
        return None

    if (
        not is_connected
        or current_session_login != account_info.login
        or current_session_server != account_info.server
    ):
        current_session_id = str(uuid.uuid4())
        current_session_login = account_info.login
        current_session_server = account_info.server
        is_connected = True

    return {
        "session_id": current_session_id,
        "account_login": current_session_login,
        "account_server": current_session_server,
    }


def symbol_tick(symbol: str):
    if not mt5.symbol_select(symbol, True):
        raise HTTPException(status_code=400, detail=f"Symbol not available: {symbol}")

    tick = mt5.symbol_info_tick(symbol)
    if tick is None:
        raise HTTPException(status_code=400, detail=f"Symbol not available: {symbol}")
    return tick


@app.on_event("startup")
def startup_event():
    try:
        init_mt5()
    except Exception as exc:
        raise RuntimeError(f"MT5 initialization failed: {exc}")


@app.on_event("shutdown")
def shutdown_event():
    mt5.shutdown()


@app.get("/status")
def status():
    sync_session_state()
    account_info = mt5.account_info()
    return {
        "connected": account_info is not None,
        "account": {
            "login": account_info.login if account_info else None,
            "server": account_info.server if account_info else None,
            "balance": account_info.balance if account_info else None,
            "equity": account_info.equity if account_info else None,
        },
    }


@app.get("/session")
def session():
    session_data = sync_session_state()
    if session_data is None:
        return {"connected": False, "session_id": None, "account_login": None, "account_server": None}

    return {
        "connected": True,
        "session_id": session_data["session_id"],
        "account_login": session_data["account_login"],
        "account_server": session_data["account_server"],
    }


@app.post("/trade")
def trade(request: TradeRequest):
    symbol = request.symbol.upper()
    if not mt5.symbol_select(symbol, True):
        raise HTTPException(status_code=400, detail=f"Failed to select symbol {symbol}")

    tick = symbol_tick(symbol)
    order_type = mt5.ORDER_TYPE_BUY if request.action.upper() == "BUY" else mt5.ORDER_TYPE_SELL
    price = tick.ask if order_type == mt5.ORDER_TYPE_BUY else tick.bid

    trade_request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": float(request.volume),
        "type": order_type,
        "price": price,
        "deviation": 20,
        "magic": LOCAL_MAGIC,
        "comment": request.comment or "iGrow local bridge",
    }

    if request.stopLoss is not None:
        trade_request["sl"] = float(request.stopLoss)
    if request.takeProfit is not None:
        trade_request["tp"] = float(request.takeProfit)

    result = mt5.order_send(trade_request)
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        raise HTTPException(status_code=400, detail=f"Trade failed: {result.comment}")

    return {
        "success": True,
        "order_id": str(result.order),
        "ticket": result.order,
        "comment": result.comment,
    }


@app.get("/positions")
def positions():
    raw = mt5.positions_get()
    if raw is None:
        raise HTTPException(status_code=400, detail=f"Failed to fetch positions: {mt5.last_error()}")

    return [
        {
            "ticket": pos.ticket,
            "symbol": pos.symbol,
            "type": "BUY" if pos.type == mt5.ORDER_TYPE_BUY else "SELL",
            "volume": float(pos.volume),
            "open_price": float(pos.price_open),
            "current_price": float(mt5.symbol_info_tick(pos.symbol).ask if pos.type == mt5.ORDER_TYPE_BUY else mt5.symbol_info_tick(pos.symbol).bid),
            "profit": float(pos.profit),
            "swap": float(pos.swap),
            "commission": float(pos.commission),
            "stop_loss": float(pos.sl) if pos.sl != 0.0 else None,
            "take_profit": float(pos.tp) if pos.tp != 0.0 else None,
            "open_time": datetime.fromtimestamp(pos.time, tz=timezone.utc),
        }
        for pos in raw
    ]


@app.post("/positions/{ticket}/close")
def close_position(ticket: int):
    raw = mt5.positions_get(ticket=ticket)
    if raw is None or len(raw) == 0:
        raise HTTPException(status_code=404, detail="Position not found")

    pos = raw[0]
    tick = symbol_tick(pos.symbol)
    close_type = mt5.ORDER_TYPE_SELL if pos.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
    price = tick.bid if close_type == mt5.ORDER_TYPE_SELL else tick.ask

    close_request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": pos.symbol,
        "volume": float(pos.volume),
        "type": close_type,
        "position": int(pos.ticket),
        "price": price,
        "deviation": 20,
        "magic": LOCAL_MAGIC,
        "comment": "iGrow close position",
    }

    result = mt5.order_send(close_request)
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        raise HTTPException(status_code=400, detail=f"Close failed: {result.comment}")

    return {"success": True, "order_id": str(result.order), "ticket": ticket}


@app.patch("/positions/{ticket}")
def modify_position(ticket: int, request: ModifyPositionRequest):
    raw = mt5.positions_get(ticket=ticket)
    if raw is None or len(raw) == 0:
        raise HTTPException(status_code=404, detail="Position not found")

    pos = raw[0]
    new_sl = float(request.stopLoss) if request.stopLoss is not None else float(pos.sl)
    new_tp = float(request.takeProfit) if request.takeProfit is not None else float(pos.tp)

    modify_request = {
        "action": mt5.TRADE_ACTION_SLTP,
        "position": int(pos.ticket),
        "symbol": pos.symbol,
        "sl": new_sl,
        "tp": new_tp,
        "magic": LOCAL_MAGIC,
        "comment": "iGrow modify SL/TP",
    }

    result = mt5.order_send(modify_request)
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        raise HTTPException(status_code=400, detail=f"Modify failed: {result.comment}")

    return {"success": True, "ticket": ticket, "comment": result.comment}


@app.get("/account")
def account_info():
    info = mt5.account_info()
    if info is None:
        raise HTTPException(status_code=400, detail=f"Failed to get account info: {mt5.last_error()}")

    return {
        "balance": float(info.balance),
        "equity": float(info.equity),
        "margin": float(info.margin),
        "margin_free": float(info.margin_free),
        "margin_level": float(info.margin_level),
        "currency": info.currency,
        "leverage": int(info.leverage),
    }


@app.get("/history")
def history(limit: int = 50):
    now = datetime.now(timezone.utc)
    from_time = now - timedelta(days=30)
    deals = mt5.history_deals_get(from_time, now)
    if deals is None:
        raise HTTPException(status_code=400, detail=f"Failed to fetch trade history: {mt5.last_error()}")

    items = []
    for deal in deals:
        items.append({
            "ticket": int(deal.ticket),
            "symbol": deal.symbol,
            "type": "BUY" if deal.type == mt5.ORDER_TYPE_BUY else "SELL",
            "volume": float(deal.volume),
            "price": float(deal.price),
            "time": datetime.fromtimestamp(deal.time, tz=timezone.utc),
            "profit": float(deal.profit),
            "commission": float(deal.commission),
            "swap": float(deal.swap),
            "order": int(deal.order),
            "position_id": int(deal.position_id),
        })

    return sorted(items, key=lambda item: item["time"], reverse=True)[:limit]


@app.get("/price")
def price(symbol: str):
    tick = symbol_tick(symbol.upper())
    return {"bid": float(tick.bid), "ask": float(tick.ask)}
