import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HouseIcon,
  CardsIcon,
  GearIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeftIcon size={20} />
              <span>Back to App</span>
            </Link>
            <h1 className="text-xl font-display">DeepTalk Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r p-4 hidden md:block">
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <HouseIcon size={20} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard/decks">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CardsIcon size={20} />
                <span>Decks</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <GearIcon size={20} />
                <span>Settings</span>
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
