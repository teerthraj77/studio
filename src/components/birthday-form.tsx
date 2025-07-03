"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createBirthdayMessage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { BirthdayDetails } from "@/lib/types";
import { Wand2, Upload } from "lucide-react";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type BirthdayFormProps = {
  initialDetails: BirthdayDetails;
  onDetailsChange: (newDetails: BirthdayDetails, imageUrl: string | null) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? "Generating..." : "Generate Message"}
      {!pending && <Wand2 className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export function BirthdayForm({ initialDetails, onDetailsChange }: BirthdayFormProps) {
  const [state, formAction] = useFormState(createBirthdayMessage, {
    message: "",
    generatedMessage: initialDetails.message,
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formValues, setFormValues] = useState({
    name: initialDetails.name,
    age: initialDetails.age.toString(),
    interests: initialDetails.interests,
  });
  const [message, setMessage] = useState(initialDetails.message);
  const [imageFile, setImageFile] = useState<File | null>(initialDetails.image);

  useEffect(() => {
    if (state.message) {
      if (state.generatedMessage) {
        setMessage(state.generatedMessage);
        toast({
          title: "Success!",
          description: "New birthday message generated.",
        });
      } else if (state.issues) {
        toast({
          title: "Error",
          description: state.message + (state.issues ? `\n- ${state.issues.join('\n- ')}` : ''),
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const stableOnDetailsChange = useCallback(onDetailsChange, []);

  useEffect(() => {
    const newImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    stableOnDetailsChange({
      name: formValues.name,
      age: Number(formValues.age) || 0,
      interests: formValues.interests,
      message,
      image: imageFile,
    }, newImageUrl);
    
    // The parent component is responsible for revoking the URL
  }, [formValues, message, imageFile, stableOnDetailsChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-headline text-2xl">Customize</SheetTitle>
        <SheetDescription>Fill in the details to create a personal birthday card.</SheetDescription>
      </SheetHeader>
      <form action={formAction} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="image-upload" className="font-bold">Profile Picture</Label>
          <div className="mt-1">
            <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {imageFile ? imageFile.name : "Upload Image"}
            </Button>
            <Input 
              id="image-upload" 
              name="image" 
              type="file" 
              accept="image/*"
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="name" className="font-bold">Name</Label>
          <Input id="name" name="name" value={formValues.name} onChange={handleInputChange} placeholder="e.g., Jane Doe" required />
        </div>
        <div>
          <Label htmlFor="age" className="font-bold">Age</Label>
          <Input id="age" name="age" type="number" value={formValues.age} onChange={handleInputChange} placeholder="e.g., 25" required />
        </div>
        <div>
          <Label htmlFor="interests" className="font-bold">Interests</Label>
          <Textarea id="interests" name="interests" value={formValues.interests} onChange={handleInputChange} placeholder="e.g., reading, coding, coffee" required />
        </div>
        
        <SubmitButton />
        
        <div className="pt-4">
          <Label htmlFor="message" className="font-bold">Birthday Message</Label>
          <Textarea 
            id="message" 
            name="message" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="A special birthday wish..."
          />
          <p className="text-sm text-muted-foreground mt-1">
            You can edit the generated message here.
          </p>
        </div>
      </form>
    </>
  );
}
