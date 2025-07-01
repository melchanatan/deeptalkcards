import CardsStack from "@/features/card/components/cards-stack";
import DeckGallery from "@/features/deck/block/deck-gallery";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: decks } = await supabase.from("decks").select("*");
  return (
    <main className="">
      <DeckGallery decks={decks} />
    </main>
  );
}
