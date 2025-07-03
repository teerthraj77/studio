'use server';
/**
 * @fileOverview A flow to generate a "Happy Birthday" song using TTS.
 *
 * - generateBirthdaySong - A function that handles song generation.
 * - GenerateBirthdaySongInput - The input type for the function.
 * - GenerateBirthdaySongOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';
import {Buffer} from 'buffer';

const GenerateBirthdaySongInputSchema = z.object({
  name: z.string().describe('The name of the birthday person.'),
});
export type GenerateBirthdaySongInput = z.infer<typeof GenerateBirthdaySongInputSchema>;

const GenerateBirthdaySongOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The generated birthday song as a data URI.'),
});
export type GenerateBirthdaySongOutput = z.infer<typeof GenerateBirthdaySongOutputSchema>;

export async function generateBirthdaySong(input: GenerateBirthdaySongInput): Promise<GenerateBirthdaySongOutput> {
  return generateBirthdaySongFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const generateBirthdaySongFlow = ai.defineFlow(
  {
    name: 'generateBirthdaySongFlow',
    inputSchema: GenerateBirthdaySongInputSchema,
    outputSchema: GenerateBirthdaySongOutputSchema,
  },
  async ({name}) => {
    const prompt = `Happy birthday to you. Happy birthday to you. Happy birthday dear ${name}. Happy birthday to you.`;
    
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt,
    });

    if (!media) {
      throw new Error('TTS media generation failed.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
