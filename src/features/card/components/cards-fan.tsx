"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import ActiveCard from "./active-card";

interface CardsFanProps {
  cards?: Array<{
    id: string;
    content?: React.ReactNode;
  }>;
  maxFanAngle?: number;
  className?: string;
  onCardSelect?: (id: string) => void;
}

// Demo content if no cards are provided
const demoCards = [
  { id: "1", content: "What's your biggest fear?" },
  { id: "2", content: "What's a childhood memory that shaped you?" },
  { id: "3", content: "What are you most grateful for?" },
  { id: "4", content: "What's something you've never told anyone?" },
  { id: "5", content: "What's your biggest regret?" },
  { id: "6", content: "What's your biggest regret?" },
  { id: "7", content: "What's your biggest regret?" },
  { id: "8", content: "What's your biggest regret?" },
  { id: "9", content: "What's your biggest regret?" },
  { id: "10", content: "What's your biggest regret?" },
  { id: "11", content: "What's your biggest regret?" },
  { id: "12", content: "What's your biggest regret?" },
  { id: "13", content: "What's your biggest regret?" },
  { id: "14", content: "What's your biggest regret?" },
  { id: "15", content: "What's your biggest regret?" },
  { id: "16", content: "What's your biggest regret?" },
  { id: "17", content: "What's your biggest regret?" },
  { id: "18", content: "What's your biggest regret?" },
  { id: "19", content: "What's your biggest regret?" },
  { id: "20", content: "What's your biggest regret?" },
  { id: "21", content: "What's your biggest regret?" },
  { id: "22", content: "What's your biggest regret?" },
  { id: "23", content: "What's your biggest regret?" },
  { id: "24", content: "What's your biggest regret?" },
  { id: "25", content: "What's your biggest regret?" },
  { id: "26", content: "What's your biggest regret?" },
  { id: "27", content: "What's your biggest regret?" },
];

// TODO: fully implement this component
const CardsFan = ({
  cards = demoCards,
  maxFanAngle = 45,
  className,
  onCardSelect,
}: CardsFanProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [remainingCards, setRemainingCards] = useState(cards);

  useEffect(() => {
    setRemainingCards(cards);
  }, [cards]);

  useEffect(() => {
    // Small delay to allow for animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardPop = (id: string) => {
    setSelectedCardId(id);
    setRemainingCards(remainingCards.filter((card) => card.id !== id));

    if (onCardSelect) {
      onCardSelect(id);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-full flex justify-center items-center",
        className
      )}
    >
      {remainingCards.map((card, index) => {
        const cardCount = remainingCards.length;
        const middleIndex = (cardCount - 1) / 2;
        const relativeIndex = index - middleIndex;

        // Calculate fan angle - spread cards more naturally
        const fanAngle =
          relativeIndex * (maxFanAngle / (cardCount > 1 ? cardCount - 1 : 1));

        // Calculate horizontal offset for fan spread
        const horizontalSpread = 50; // Base spacing between cards
        const horizontalOffset = relativeIndex * horizontalSpread;

        // Calculate vertical offset - cards further from center are slightly lower
        const verticalOffset = Math.abs(relativeIndex) * 15;

        // Calculate z-index - center cards on top
        const zIndex = index;

        return (
          <motion.div
            key={card.id}
            className="absolute"
            initial={{
              rotateZ: 0,
              x: 0,
              y: 100,
              opacity: 0,
            }}
            animate={{
              rotateZ: isLoaded ? fanAngle : 0,
              x: isLoaded ? horizontalOffset : 0,
              y: isLoaded ? verticalOffset : 100,
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              type: "spring",
              stiffness: 80,
              damping: 12,
            }}
            style={{
              zIndex,
              transformOrigin: "center bottom",
            }}
          >
            <ActiveCard
              content={card.content}
              onCardPop={() => handleCardPop(card.id)}
              className={cn(
                "transition-all duration-300 hover:scale-105 hover:translate-y-[-10px]",
                "hover:shadow-2xl"
              )}
              cardStyle={{
                transformOrigin: "center bottom",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardsFan;
