# Registration & Downline System Implementation Guide

## Overview
This document describes the complete registration approval workflow and downline tree system implemented for the iGrow platform.

## System Workflow

### 1. User Registration
- User fills registration form with plan selection
- Data is sent to `/api/registrations` (POST)
- Registration is created with status: `pending`
- Plan amount is automatically extracted from program string
- User receives confirmation message

### 2. Admin Approval
**Admin Dashboard**: `/admin`
- Admin logs in with credentials
- Views all registrations in a table
- Can filter by name, email, or phone
- Each pending registration shows:
  - User details (name, email, phone)
  - Program selected
  - Plan amount (₹)
  - Current status badge
- Admin can:
  - **Approve**: Clicking "Approve" button sends `POST /api/registrations/{id}` with `action: 'approve'`
  - **Reject**: Clicking "Reject" button sends `POST /api/registrations/{id}` with `action: 'reject'`

When approved:
- Status changes to `approved`
- `approvedAt` timestamp is recorded
- If user has a referral code, they are linked to their parent (downline tree structure)

### 3. User Login
**Login Page**: `/login`
- User attempts to login with email and password
- System checks registration status:
  - If status is `pending`: Shows error "Your registration is pending admin approval"
  - If status is `rejected`: Shows error with rejection reason
  - If status is `approved`: Login successful, stores user data with plan info

### 4. User Dashboard
**Dashboard**: `/user/dashboard`

After login, user sees:

#### a) Status Alert
- If pending: Yellow alert showing approval pending
- If approved: Green alert confirming account is active

#### b) Plan Information (Only if approved)
- Displays selected program
- Shows plan amount (₹)
- Shows account status

#### c) Downline Tree View (Only if approved)
- Shows the user's complete network of referrals
- Displays stats:
  - Total Members: Count of all direct + indirect referrals
  - Total Revenue: Sum of all downline plan amounts
  - Network Levels: Depth of the referral tree
- Shows expandable/collapsible tree with each member:
  - Name
  - Email
  - Status badge
  - Plan amount
  - Join date

#### d) Referral Program Section
- Shows referral code (e.g., IGROW-{userId})
- Displays referral link for sharing
- Shows referral benefits
- Lists all referral tier levels

## API Endpoints

### Registration Endpoints

#### POST /api/registrations
Create new registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "program": "GROW PROGRAM - ₹50,000",
  "referralCode": "IGROW-12345",
  "password": "secure123",
  "confirmPassword": "secure123"
}
```

Response:
```json
{
  "message": "Registration successful! Awaiting admin approval.",
  "registration": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2024-05-22",
    "status": "pending"
  }
}
```

#### GET /api/registrations
Get all registrations (used by admin dashboard)

Response:
```json
{
  "registrations": [/* array of all registrations */],
  "total": 45
}
```

#### POST /api/registrations/{id}
Approve or reject a registration

Request:
```json
{
  "action": "approve" // or "reject"
}
```

For rejection:
```json
{
  "action": "reject",
  "reason": "Documents not verified"
}
```

#### GET /api/registrations/{id}/downline
Get user's downline tree and statistics

Response:
```json
{
  "user": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "planAmount": 50000,
    "status": "approved",
    "joinDate": "2024-05-22"
  },
  "downline": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "approved",
    "planAmount": 50000,
    "joinDate": "2024-05-22",
    "children": [
      {
        "id": "1234567891",
        "name": "Alice Smith",
        "email": "alice@example.com",
        "status": "approved",
        "planAmount": 75000,
        "joinDate": "2024-05-23",
        "children": [/* ... */]
      }
    ]
  },
  "stats": {
    "totalMembers": 15,
    "totalRevenue": 1050000,
    "levels": 4
  }
}
```

### Login Endpoint

#### POST /api/auth/login
Authenticate user (checks approval status)

Request:
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

Response (if approved):
```json
{
  "message": "Login successful",
  "token": "...",
  "user": {
    "id": "1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "status": "approved",
    "planAmount": 50000,
    "program": "GROW PROGRAM - ₹50,000",
    "approvedAt": "2024-05-22T10:30:00Z"
  }
}
```

## Data Model

### Registration Object
```typescript
{
  id: string              // Unique identifier
  name: string           // User's full name
  email: string          // User's email
  phone: string          // Contact number
  address: string        // Physical address
  program: string        // Selected program (e.g., "GROW - ₹50,000")
  planAmount: number     // Extracted amount in ₹
  referralCode: string   // Parent's referral code
  referralName: string   // Parent's name
  password: string       // User password (should be hashed in production)
  date: string          // Registration date (YYYY-MM-DD)
  status: "pending" | "approved" | "rejected"
  approvedAt: string | null    // Approval timestamp
  rejectionReason: string      // Reason for rejection
  parentId: string       // ID of parent user (for tree structure)
  downline: string[]     // Array of direct referral IDs
}
```

## Features Implemented

✅ User registration with plan selection
✅ Admin approval/rejection workflow
✅ Login authentication with status checking
✅ Plan amount tracking and display
✅ Downline tree structure
✅ Network statistics (members, revenue, levels)
✅ Expandable/collapsible tree view UI
✅ Status alerts on user dashboard
✅ Referral code generation and sharing
✅ Pending approval notifications

## Testing Guide

### Test Scenario 1: Successful Registration & Approval
1. Register a user at `/login` with any plan
2. Go to `/admin` (login: admin/admin123)
3. Find the registration and click "Approve"
4. User should now be able to login
5. Dashboard should show plan info

### Test Scenario 2: Referral Linking
1. Register User A (no referral code)
2. Register User B using User A's referral code: IGROW-{User A ID}
3. Approve both registrations
4. Login as User A
5. Check downline tree - should show User B

### Test Scenario 3: Multi-Level Network
1. Register User A
2. Register User B with User A's code
3. Register User C with User B's code
4. Register User D with User C's code
5. Approve all
6. Login as User A
7. Downline tree should show: B → C → D with stats

## Future Enhancements

- Database integration (replace in-memory storage)
- Password hashing (bcrypt)
- Email notifications for approval/rejection
- Payment integration
- Commission calculations
- Admin approval history and audit logs
- User profile editing
- KYC/document verification
- SMS notifications
- Dashboard charts and analytics
