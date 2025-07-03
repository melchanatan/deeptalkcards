"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function EditDeckPage() {
  const router = useRouter();
  const { deckId } = useParams<{ deckId: string }>();

  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [difficulty, setDifficulty] = useState(1);
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
          .select("*")
          .eq("id", deckId)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || "");
          setAuthorName(data.author_name || "");
          setDifficulty(data.difficulty || 1);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load deck");
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
      const { error } = await supabase
        .from("decks")
        .update({
          title,
          author_name: authorName,
          difficulty,
        })
        .eq("id", deckId);

      if (error) throw error;

      router.push(`/dashboard/decks/${deckId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update deck");
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
        <h1 className="text-3xl font-display mb-8">Edit Deck</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium">
              Deck Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md p-2"
              placeholder="Enter deck title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="authorName" className="block font-medium">
              Author Name
            </label>
            <input
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Enter author name (optional)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="block font-medium">
              Difficulty Level
            </label>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    difficulty === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={`/dashboard/decks/${deckId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
