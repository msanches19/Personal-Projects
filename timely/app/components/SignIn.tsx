import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { signIn } from "../utils/auth";
import { GitHubAuthButton, GoogleAuthButton } from "./SubmitButtons";

export function SignIn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row justify-center items-center gap-2">
          <div className="-ml-1 flex items-center gap-2">
            <CalendarDays className="w-9 h-9"></CalendarDays>
            <h4 className="text-3xl">Time<span className="text-primary">ly</span></h4>
          </div>
        </DialogHeader>
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="flex flex-col mt-5 gap-2">
          <form action = {async () => {
            "use server"
            await signIn("google")
          }} className="w-full">
            <GoogleAuthButton />
          </form>
          <form action = {async () => {
            "use server"
            await signIn("github")
          }}>
            <GitHubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}