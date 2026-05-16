'use server';
/**
 * @fileOverview An AI Trading Mentor agent that analyzes user input
 * and suggests the most appropriate iGrow training program.
 *
 * - aiTradingMentorProgramSuggestion - A function that handles the program suggestion process.
 * - AITradingMentorProgramSuggestionInput - The input type for the aiTradingMentorProgramSuggestion function.
 * - AITradingMentorProgramSuggestionOutput - The return type for the aiTradingMentorProgramSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITradingMentorProgramSuggestionInputSchema = z.object({
  financialGoals: z
    .string()
    .describe('The financial goals of the prospective student.'),
  tradingExperience: z
    .string()
    .describe('The current trading experience level of the prospective student.'),
});
export type AITradingMentorProgramSuggestionInput = z.infer<
  typeof AITradingMentorProgramSuggestionInputSchema
>;

const AITradingMentorProgramSuggestionOutputSchema = z.object({
  recommendedProgram: z
    .enum(['Basic', 'Advanced', 'Advanced 2.0', 'Combo', 'Internship'])
    .describe('The most suitable iGrow training program from the catalog.'),
  justification: z
    .string()
    .describe('A brief explanation of why this program is recommended.'),
});
export type AITradingMentorProgramSuggestionOutput = z.infer<
  typeof AITradingMentorProgramSuggestionOutputSchema
>;

export async function aiTradingMentorProgramSuggestion(
  input: AITradingMentorProgramSuggestionInput
): Promise<AITradingMentorProgramSuggestionOutput> {
  return aiTradingMentorProgramSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTradingMentorProgramSuggestionPrompt',
  input: {schema: AITradingMentorProgramSuggestionInputSchema},
  output: {schema: AITradingMentorProgramSuggestionOutputSchema},
  prompt: `You are an AI Trading Mentor for iGrow Learning Society. Your goal is to help prospective students find the best training program based on their financial goals and trading experience.

Here are the available iGrow training programs:
- Basic: Introduction to trading for beginners. Focuses on fundamentals.
- Advanced: For traders with some experience, covering more complex strategies.
- Advanced 2.0: Deeper dive into advanced techniques and market analysis.
- Combo: A comprehensive package that combines multiple programs.
- Internship: Practical, hands-on experience in a trading environment.

Analyze the user's input below and recommend the SINGLE most suitable program from the list above. Provide a clear justification for your recommendation.

Financial Goals: {{{financialGoals}}}
Trading Experience: {{{tradingExperience}}}`,
});

const aiTradingMentorProgramSuggestionFlow = ai.defineFlow(
  {
    name: 'aiTradingMentorProgramSuggestionFlow',
    inputSchema: AITradingMentorProgramSuggestionInputSchema,
    outputSchema: AITradingMentorProgramSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
