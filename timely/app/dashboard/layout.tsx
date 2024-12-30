import { CalendarDays, Menu, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DashboardLinks } from "../components/DashboardLinks";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth, signOut } from "../utils/auth";
import { checkUser } from "../utils/hooks";
import prisma from "../utils/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      username: true,
      grantId: true
    }
  });

  if (!data?.username) {
    return redirect("/onboarding")
  }

  if (!data.grantId) {
    return redirect("/onboarding/grant-id")
  }

  return data
}

export default async function DashboardLayout({children}: {children: ReactNode}) {
  const session = await checkUser()

  const data = await getData(session.user?.id as string)

  const defaultProfilePic = !session?.user?.image || session.user.image.includes("default")

  return (
    <>
      <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block border-r bg-muted/40 ">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-2">
              <Link href="/" className="flex items-center gap-2">
                <CalendarDays className="size-8"></CalendarDays>
                <p className="text-3xl">Timely</p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <header className="flex h-14 items-center border-b gap-4 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden shrink-0" size="icon" variant="outline">
                  <Menu className="size-5"/>
                </Button>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="left" className="flex flex-col">
                <nav className="gap-2 grid mt-10">
                  <DashboardLinks />
                </nav>
                <SheetTitle className="sr-only"></SheetTitle>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-x-4">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary' size='icon' className="rounded-full">
                    {defaultProfilePic
                    ? (<User></User>)
                    : (<img src={session.user?.image as string} alt="Profile Pic" width={20} height={20} className="w-full h-full rounded-full"></img>)
                    }
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <form className="w-full" action={async () => {
                        "use server"
                        await signOut();
                      }}>
                        <button className="w-full text-left">Log Out</button>
                      </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6 lg:gap-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton />
    </>
  )
}