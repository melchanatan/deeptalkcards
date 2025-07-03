"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function NewCardPage() {
  const router = useRouter();
  const { deckId } = useParams<{ deckId: string }>();

  const [content, setContent] = useState("");
  const [contentTh, setContentTh] = useState("");
  const [bulkContent, setBulkContent] = useState("");
  const [bulkContentTh, setBulkContentTh] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
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
      if (isBulkMode) {
        // Process bulk content
        const englishLines = bulkContent
          .trim()
          .split("\n")
          .filter((line) => line.trim() !== "");
        const thaiLines = bulkContentTh
          .trim()
          .split("\n")
          .filter((line) => line.trim() !== "");

        if (englishLines.length === 0) {
          throw new Error("Please enter at least one card in English");
        }

        // Prepare cards for insertion
        const cardsToInsert = englishLines.map((line, index) => ({
          content_us: line.trim(),
          content_th: thaiLines[index]?.trim() || null,
          deck_id: deckId,
        }));

        // Insert all cards
        const { error: cardError } = await supabase
          .from("cards")
          .insert(cardsToInsert);

        if (cardError) throw cardError;

        // Update the cards count in the deck
        const { data: deckData, error: deckError } = await supabase
          .from("decks")
          .select("cards_count")
          .eq("id", deckId)
          .single();

        if (deckError) throw deckError;

        const newCount = (deckData.cards_count || 0) + cardsToInsert.length;

        const { error: updateError } = await supabase
          .from("decks")
          .update({ cards_count: newCount })
          .eq("id", deckId);

        if (updateError) throw updateError;
      } else {
        // Insert a single card
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
      }

      // Redirect back to deck management page
      router.push(`/dashboard/decks/${deckId}`);
    } catch (err: any) {
      setError(err.message || "Failed to create card(s)");
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
        <h1 className="text-3xl font-display mb-2">
          Add New Card{isBulkMode ? "s" : ""}
        </h1>
        <p className="text-muted-foreground mb-4">to deck: {deckTitle}</p>

        <div className="flex gap-4 mb-6">
          <Button
            type="button"
            variant={isBulkMode ? "outline" : "default"}
            onClick={() => setIsBulkMode(false)}
          >
            Single Card
          </Button>
          <Button
            type="button"
            variant={isBulkMode ? "default" : "outline"}
            onClick={() => setIsBulkMode(true)}
          >
            Bulk Create
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isBulkMode ? (
            <>
              <div className="space-y-2">
                <label htmlFor="bulkContent" className="block font-medium">
                  Card Content (English) - One card per line
                </label>
                <textarea
                  id="bulkContent"
                  value={bulkContent}
                  onChange={(e) => setBulkContent(e.target.value)}
                  required
                  className="w-full border rounded-md p-2 min-h-32"
                  placeholder="Enter card content in English (one card per line)"
                />
                <p className="text-sm text-muted-foreground">
                  {
                    bulkContent.split("\n").filter((line) => line.trim() !== "")
                      .length
                  }{" "}
                  cards will be created
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="bulkContentTh" className="block font-medium">
                  Card Content (Thai - Optional) - One card per line
                </label>
                <textarea
                  id="bulkContentTh"
                  value={bulkContentTh}
                  onChange={(e) => setBulkContentTh(e.target.value)}
                  className="w-full border rounded-md p-2 min-h-32"
                  placeholder="Enter card content in Thai (one card per line, matching the English lines)"
                />
                <p className="text-sm text-muted-foreground">
                  Make sure the number of Thai lines matches the English lines
                  for proper pairing
                </p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Link href={`/dashboard/decks/${deckId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating..."
                : isBulkMode
                ? "Add Cards"
                : "Add Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
