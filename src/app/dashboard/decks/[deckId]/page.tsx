"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function DeckManagementPage() {
  const router = useRouter();
  const params = useParams();
  const { deckId } = params;

  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      setIsLoading(true);
      try {
        // Fetch deck details
        const { data: deckData, error: deckError } = await supabase
          .from("decks")
          .select("*")
          .eq("id", deckId)
          .single();

        if (deckError) throw deckError;
        setDeck(deckData);

        // Fetch cards for this deck
        const { data: cardsData, error: cardsError } = await supabase
          .from("cards")
          .select("*")
          .eq("deck_id", deckId);

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load deck data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [deckId]);

  const handleDeleteDeck = async () => {
    try {
      // First delete all cards associated with this deck
      await supabase.from("cards").delete().eq("deck_id", deckId);

      // Then delete the deck itself
      const { error } = await supabase.from("decks").delete().eq("id", deckId);

      if (error) throw error;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to delete deck");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) throw error;

      // Update local state
      setCards(cards.filter((card) => card.id !== cardId));

      // Update cards_count in deck
      await supabase
        .from("decks")
        .update({ cards_count: cards.length - 1 })
        .eq("id", deckId);

      setDeck({ ...deck, cards_count: cards.length - 1 });
    } catch (err: any) {
      setError(err.message || "Failed to delete card");
    }
  };

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl mb-4">Deck not found</h2>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display">{deck.title}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/decks/${deckId}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <PencilIcon size={18} />
              <span>Edit Deck</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <TrashIcon size={18} />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="bg-secondary/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Deck Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Author:</strong> {deck.author_name || "Not specified"}
              </p>
              <p>
                <strong>Difficulty:</strong>{" "}
                {Array.from({ length: deck.difficulty })
                  .map(() => "/")
                  .join("")}
              </p>
              <p>
                <strong>Cards:</strong> {cards.length}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-secondary/20 rounded-lg p-6 h-full flex flex-col justify-center items-center">
            <Link
              href={`/dashboard/decks/${deckId}/cards/new`}
              className="w-full"
            >
              <Button className="w-full flex items-center gap-2 mb-4">
                <PlusIcon size={20} />
                <span>Add New Card</span>
              </Button>
            </Link>
            <Link href={`/deck/${deckId}`} className="w-full">
              <Button variant="secondary" className="w-full">
                View Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-display mb-4">Cards</h2>

      {cards.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-xl mb-4">No cards in this deck yet</p>
          <Link href={`/dashboard/decks/${deckId}/cards/new`}>
            <Button>Add your first card</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="border rounded-lg p-4">
              <AspectRatio
                ratio={9 / 16}
                className="mb-4 bg-secondary/10 rounded-lg"
              >
                <div className="h-full w-full flex items-center justify-center p-4 text-center overflow-hidden">
                  <p className="line-clamp-6">{card.content_us}</p>
                </div>
              </AspectRatio>
              <div className="flex justify-between">
                <Link href={`/dashboard/decks/${deckId}/cards/${card.id}`}>
                  <Button variant="outline" size="sm">
                    <PencilIcon size={16} className="mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  <TrashIcon size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Deck</h3>
            <p className="mb-6">
              Are you sure you want to delete &ldquo;{deck.title}&ldquo;? This
              will also delete all {cards.length} cards in this deck. This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDeck}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
