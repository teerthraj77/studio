"use client";

import { useCallback, useState, useEffect } from "react";
import { BirthdayCard } from "@/components/birthday-card";
import { BirthdayForm } from "@/components/birthday-form";
import type { BirthdayDetails } from "@/lib/types";
import { PartyPopper, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [details, setDetails] = useState<BirthdayDetails>({
    name: "Alex Doe",
    age: 30,
    interests: "hiking, photography, and trying new recipes",
    message: "Happy 30th Birthday, Alex! May your day be as wonderful as you are. Wishing you a year filled with amazing adventures, beautiful moments captured, and delicious new dishes to savor. Cheers to you!",
    image: null,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDetailsChange = useCallback((newDetails: BirthdayDetails, newImageUrl: string | null) => {
    setDetails(prevDetails => {
      // Only update if there are actual changes
      if (JSON.stringify(prevDetails) !== JSON.stringify(newDetails)) {
        return newDetails;
      }
      return prevDetails;
    });
    
    setImageUrl(prevUrl => {
      if (newImageUrl !== prevUrl) {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return newImageUrl;
      }
      return prevUrl;
    });
  }, []);

  useEffect(() => {
    // Clean up the object URL when the component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);


  return (
    <main className="relative container mx-auto flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <header className="absolute top-8 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl flex items-center justify-center gap-4">
          <PartyPopper className="h-12 w-12 text-accent" />
          Birthday Bliss
          <PartyPopper className="h-12 w-12 text-accent" />
        </h1>
      </header>
      
      <div className="w-full max-w-lg">
        <BirthdayCard {...details} image={imageUrl} />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" className="absolute bottom-8 right-8 rounded-full h-14 w-14 shadow-lg">
            <Settings className="h-6 w-6" />
            <span className="sr-only">Customize</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto w-[90vw] sm:w-[540px] sm:max-w-none">
           <BirthdayForm initialDetails={details} onDetailsChange={handleDetailsChange} />
        </SheetContent>
      </Sheet>
    </main>
  );
}
