import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: decks } = await supabase.from("decks").select("*");

  return (
    <main className="container py-10">
      <h1 className="text-4xl font-display mb-8">Deck Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">Your Decks</h2>
        <Link href="/dashboard/decks/new">
          <Button className="flex items-center gap-2">
            <PlusIcon size={20} />
            <span>New Deck</span>
          </Button>
        </Link>
      </div>

      {decks && decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck: any) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-xl mb-4">You don't have any decks yet</p>
          <Link href="/dashboard/decks/new">
            <Button>Create your first deck</Button>
          </Link>
        </div>
      )}
    </main>
  );
}

function DeckCard({ deck }: { deck: any }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
      <p className="text-muted-foreground mb-2">
        {deck.cards_count || 0} cards • Difficulty:{" "}
        {Array.from({ length: deck.difficulty || 0 }).map(() => "/")}
      </p>
      {deck.author_name && (
        <p className="text-sm mb-4">by {deck.author_name}</p>
      )}

      <div className="mt-auto flex gap-2">
        <Link href={`/dashboard/decks/${deck.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Manage
          </Button>
        </Link>
        <Link href={`/deck/${deck.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
