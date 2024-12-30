"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import google from "@/public/google.svg"
import github from '@/public/github.svg'
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IAppProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string
  disabled?: boolean
  popup?: boolean
  popupMessage?: string
}

export function SubmitButton({ text, variant, className, disabled, popup, popupMessage }: IAppProps) {
  const {pending} = useFormStatus()

  return (
    <>
    {pending ?(
      <Button disabled variant="outline" className={cn("w-fit", className)}>
        <Loader2 className="size-4 mr-2 animate-spin"/>
      </Button>
    ) : (
      <Button 
        type="submit"
        variant={variant} 
        className={cn("w-fit", className)} 
        disabled={disabled}
        onClick={() => {
          if (popup) {
            toast.success(popupMessage)
          }
        }}>
          {text}
      </Button>
    )}

    </>
  )
}


export function GoogleAuthButton() {
  const {pending} = useFormStatus()

  return (
    <>
      {pending ? 
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin">
            Loading...
          </Loader2>
        </Button> :
        <Button variant="outline" className="w-full">
          <Image src={google} alt="google logo" className="size-4 mr-2"></Image>
          Sign in with Google
        </Button>
      }
    </>
  )
}

export function GitHubAuthButton() {
  const {pending} = useFormStatus()

  return (
    <>
      {pending ? 
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin">
            Loading...
          </Loader2>
        </Button> :
        <Button variant="outline" className="w-full">
          <Image src={github} alt="github logo" className="size-4 mr-2"></Image>
          Sign in with GitHub
        </Button>
      }
    </>
  )

}