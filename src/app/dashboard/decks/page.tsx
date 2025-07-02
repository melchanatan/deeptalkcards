"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

export default function DecksPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const { data, error } = await supabase.from("decks").select("*");

        if (error) throw error;

        setDecks(data || []);
        setFilteredDecks(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load decks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecks();
  }, [supabase]);

  useEffect(() => {
    // Apply filters
    let result = [...decks];

    if (searchQuery) {
      result = result.filter(
        (deck) =>
          deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (deck.author_name &&
            deck.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (difficultyFilter !== null) {
      result = result.filter((deck) => deck.difficulty === difficultyFilter);
    }

    setFilteredDecks(result);
  }, [searchQuery, difficultyFilter, decks]);

  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter(null);
  };

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display">All Decks</h1>
        <Link href="/dashboard/decks/new">
          <Button className="flex items-center gap-2">
            <PlusIcon size={20} />
            <span>New Deck</span>
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/10 p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author"
                className="w-full border rounded-md p-2 pl-10"
              />
              <MagnifyingGlassIcon
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium mb-1"
            >
              Difficulty
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setDifficultyFilter(
                      difficultyFilter === level ? null : level
                    )
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    difficultyFilter === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!searchQuery && difficultyFilter === null}
            className="md:self-end"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {filteredDecks.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-xl mb-4">No decks found</p>
          {decks.length > 0 ? (
            <Button onClick={clearFilters}>Clear Filters</Button>
          ) : (
            <Link href="/dashboard/decks/new">
              <Button>Create your first deck</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => (
            <div key={deck.id} className="border rounded-lg p-4 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
              <p className="text-muted-foreground mb-2">
                {deck.cards_count || 0} cards • Difficulty:{" "}
                {Array.from({ length: deck.difficulty || 0 })
                  .map(() => "/")
                  .join("")}
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
          ))}
        </div>
      )}
    </div>
  );
}
