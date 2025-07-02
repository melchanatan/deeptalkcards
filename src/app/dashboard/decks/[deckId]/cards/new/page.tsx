"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function NewCardPage({
  params,
}: {
  params: { deckId: string };
}) {
  const router = useRouter();
  const { deckId } = params;

  const [content, setContent] = useState("");
  const [contentTh, setContentTh] = useState("");
  const [deckTitle, setDeckTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const { data, error } = await supabase
          .from("decks")
          .select("title, cards_count")
          .eq("id", deckId)
          .single();

        if (error) throw error;

        if (data) {
          setDeckTitle(data.title);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load deck information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeck();
  }, [deckId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Insert the new card
      const { data: cardData, error: cardError } = await supabase
        .from("cards")
        .insert([
          {
            content_us: content,
            content_th: contentTh || null,
            deck_id: deckId,
          },
        ])
        .select();

      if (cardError) throw cardError;

      // Update the cards count in the deck
      const { data: deckData, error: deckError } = await supabase
        .from("decks")
        .select("cards_count")
        .eq("id", deckId)
        .single();

      if (deckError) throw deckError;

      const newCount = (deckData.cards_count || 0) + 1;

      const { error: updateError } = await supabase
        .from("decks")
        .update({ cards_count: newCount })
        .eq("id", deckId);

      if (updateError) throw updateError;

      // Redirect back to deck management page
      router.push(`/dashboard/decks/${deckId}`);
    } catch (err: any) {
      setError(err.message || "Failed to create card");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display mb-2">Add New Card</h1>
        <p className="text-muted-foreground mb-8">to deck: {deckTitle}</p>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="content" className="block font-medium">
              Card Content (English)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border rounded-md p-2 min-h-32"
              placeholder="Enter card content in English"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contentTh" className="block font-medium">
              Card Content (Thai - Optional)
            </label>
            <textarea
              id="contentTh"
              value={contentTh}
              onChange={(e) => setContentTh(e.target.value)}
              className="w-full border rounded-md p-2 min-h-32"
              placeholder="Enter card content in Thai (optional)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={`/dashboard/decks/${deckId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Add Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
