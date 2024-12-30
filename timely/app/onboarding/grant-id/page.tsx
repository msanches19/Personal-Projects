import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, Loader2 } from "lucide-react";
import Link from "next/link";


export default function OnboardCalendar() {
  return <div className="min-h-screen w-screen flex items-center justify-center">
    <Card>
      <CardHeader>
        <CardTitle>
          You are almost done...
        </CardTitle>
        <CardDescription>
          Connecting your calendar to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Button asChild className="w-full">
          <Link href="/api/auth">
            <CalendarCheck2 /> 
            Connect calendar
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
}