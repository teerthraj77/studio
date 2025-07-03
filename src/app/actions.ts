"use server";

import { generateBirthdayMessage, type GenerateBirthdayMessageInput } from "@/ai/flows/generate-birthday-message";
import { generateBirthdaySong } from "@/ai/flows/generate-birthday-song";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().int().positive("Age must be a positive number."),
  interests: z.string().min(5, "Please list some interests."),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  generatedMessage?: string;
}

export async function createBirthdayMessage(prevState: FormState, formData: FormData) : Promise<FormState> {
  const data = Object.fromEntries(formData);
  const parsed = formSchema.safeParse(data);
  
  if (!parsed.success) {
    return {
      message: "Please check the fields below.",
      fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.toString()])),
      issues: parsed.error.issues.map(issue => issue.message),
    };
  }
  
  try {
    const { name, age, interests } = parsed.data;
    const input: GenerateBirthdayMessageInput = { name, age, interests };
    const result = await generateBirthdayMessage(input);
    
    return {
      message: "Message generated successfully!",
      generatedMessage: result.message,
    };
  } catch (error) {
    return {
      message: "Failed to generate message. Please try again.",
      issues: [error instanceof Error ? error.message : "An unknown error occurred."],
    };
  }
}

export async function generateBirthdaySongAction(name: string): Promise<{ songUrl?: string; error?: string }> {
  if (!name) {
    return { error: 'Name is required to generate a song.' };
  }
  try {
    const result = await generateBirthdaySong({ name });
    return { songUrl: result.audioDataUri };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to generate the birthday song: ${errorMessage}` };
  }
}
