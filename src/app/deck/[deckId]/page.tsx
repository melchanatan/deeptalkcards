import CardsStack from "@/features/card/components/cards-stack";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home({ params }: { params: { deckId: string } }) {
  const { deckId } = await params;
  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", deckId);

  const { data: deck } = await supabase
    .from("decks")
    .select("difficulty")
    .eq("id", deckId)
    .single();

  if (!cards || !deck) {
    return (
      <div className="text-2xl font-display h-dvh flex flex-col items-center justify-center gap-2">
        This deck is not found
        <Link href="/" className="text-accent ">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-dvh overflow-hidden">
      <CardsStack cards={cards} difficulty={deck?.difficulty} />
    </main>
  );
}
