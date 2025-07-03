'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized birthday message.
 *
 * The flow takes the birthday person's name, age, and interests as input, and generates a personalized birthday message.
 * @interface GenerateBirthdayMessageInput - Defines the input schema for the generateBirthdayMessage function.
 * @interface GenerateBirthdayMessageOutput - Defines the output schema for the generateBirthdayMessage function.
 * @function generateBirthdayMessage - A function that calls the generateBirthdayMessageFlow to generate a personalized birthday message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBirthdayMessageInputSchema = z.object({
  name: z.string().describe('The name of the birthday person.'),
  age: z.number().describe('The age of the birthday person.'),
  interests: z.string().describe('The interests of the birthday person.'),
});

export type GenerateBirthdayMessageInput = z.infer<typeof GenerateBirthdayMessageInputSchema>;

const GenerateBirthdayMessageOutputSchema = z.object({
  message: z.string().describe('A personalized birthday message.'),
});

export type GenerateBirthdayMessageOutput = z.infer<typeof GenerateBirthdayMessageOutputSchema>;

export async function generateBirthdayMessage(input: GenerateBirthdayMessageInput): Promise<GenerateBirthdayMessageOutput> {
  return generateBirthdayMessageFlow(input);
}

const generateBirthdayMessagePrompt = ai.definePrompt({
  name: 'generateBirthdayMessagePrompt',
  input: {schema: GenerateBirthdayMessageInputSchema},
  output: {schema: GenerateBirthdayMessageOutputSchema},
  prompt: `Generate a personalized birthday message for {{name}}, who is turning {{age}} years old. Their interests include: {{interests}}.  The message should be cheerful and celebratory.`,
});

const generateBirthdayMessageFlow = ai.defineFlow(
  {
    name: 'generateBirthdayMessageFlow',
    inputSchema: GenerateBirthdayMessageInputSchema,
    outputSchema: GenerateBirthdayMessageOutputSchema,
  },
  async input => {
    const {output} = await generateBirthdayMessagePrompt(input);
    return output!;
  }
);
