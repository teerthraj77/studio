"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Gift, Music, LoaderCircle } from "lucide-react";

type BirthdayCardProps = {
  name: string;
  age: number;
  message: string;
  image: string | null;
  songUrl: string | null;
  isSinging: boolean;
  onSing: (name: string) => void;
};

export function BirthdayCard({ name, age, message, image, songUrl, isSinging, onSing }: BirthdayCardProps) {
  return (
    <div className="transition-all duration-500 ease-in-out animate-in fade-in zoom-in-95">
      <Card className="w-full overflow-hidden shadow-2xl shadow-primary/20 rounded-xl">
        <CardHeader className="items-center bg-primary/20 p-6 text-center">
          <div className="relative mb-4 h-40 w-40 rounded-full border-4 border-white shadow-lg">
            <Image
              key={image}
              src={image || "https://placehold.co/200x200.png"}
              alt={`Photo of ${name}`}
              width={200}
              height={200}
              className="rounded-full object-cover"
              data-ai-hint="person happy"
            />
          </div>
          <CardTitle className="font-headline text-4xl font-bold text-primary-foreground">
            Happy Birthday, {name}!
          </CardTitle>
          <p className="flex items-center gap-2 text-xl font-semibold text-accent-foreground">
            <Cake className="h-6 w-6" />
            You're {age} years old!
            <Gift className="h-6 w-6" />
          </p>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="font-body text-lg leading-relaxed text-muted-foreground transition-opacity duration-300 min-h-[100px]">
            &ldquo;{message}&rdquo;
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4 p-6 pt-0">
          <Button onClick={() => onSing(name)} disabled={isSinging} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
            {isSinging ? <LoaderCircle className="animate-spin" /> : <Music />}
            {isSinging ? "Generating Song..." : "Sing Happy Birthday!"}
          </Button>
          {songUrl && (
            <div className="w-full">
               <audio key={songUrl} controls autoPlay className="w-full">
                <source src={songUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
