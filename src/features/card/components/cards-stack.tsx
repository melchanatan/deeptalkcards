"use client";
import { cn } from "@/lib/utils";
import Card from "./card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const demoContent = [
  {
    id: 1,
    title: "Card 1",
    content: "Content 1",
  },
  {
    id: 2,
    title: "Card 2",
    content: "Content 2",
  },
  {
    id: 3,
    title: "Card 3",
    content: "Content 3",
  },
  {
    id: 4,
    title: "Card 4",
    content: "Content 3",
  },
  {
    id: 5,
    title: "Card 5",
    content: "Content 5",
  },
];

interface Card {
  id: number;
  title: string;
  content: string;
  rotation?: number;
}

const CardsStack = () => {
  const [cards, setCards] = useState<Card[]>([]);

  function mutateRandomRotation(cards: Card[]) {
    return cards.map((card) => {
      return {
        ...card,
        rotation: Math.round(Math.random() * 10 - 5),
      };
    });
  }

  function shuffleCards() {
    setCards(mutateRandomRotation(demoContent));
  }

  function popCard() {
    if (cards.length <= 0) return;
    setCards(cards.slice(0, -1));
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <>
      <div className="relative flex flex-col gap-4">
        {cards.map((item, index) => {
          // const randomNumber = Math.round(Math.random() * 10 - 5);
          const brightness = 1 - (demoContent.length - index) * 0.1;
          if (brightness <= 0) return null;

          return (
            <Card
              key={item.id}
              content={item.content}
              isActiveCard={index === cards.length - 1}
              className={cn("absolute top-0 left-0")}
              style={{
                filter: `brightness(${brightness})`,
              }}
              cardStyle={{
                transform: `
              rotateZ(${item.rotation}deg)
               translateX(${item.rotation}px) 
               translateY(${item.rotation ? item.rotation * -1 : 0}px)
               `,
              }}
            />
          );
        })}
        <Button onClick={popCard}>Pop Card</Button>
        <Button onClick={shuffleCards}>Shuffle Cards</Button>
      </div>
      <div className="absolute bottom-4 w-full container font-display flex justify-between items-center text-xl">
        <p>0/52</p>
        <p>////</p>
      </div>
    </>
  );
};

export default CardsStack;
