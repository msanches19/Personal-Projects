import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from 'lucide-react';
import { SignIn } from "./SignIn";

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <CalendarDays className="w-9 h-9"></CalendarDays>
        <h4 className="text-3xl">
          Timely
        </h4>
      </Link>

      <SignIn />
    </div>
  )
}