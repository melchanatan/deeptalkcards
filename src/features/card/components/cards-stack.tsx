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

const CardsStack = () => {
  const [cards, setCards] = useState(demoContent);

  function shuffleCards() {
    setCards(demoContent.sort(() => Math.random() - 0.5));
  }

  function popCard() {
    if (cards.length <= 0) return;
    setCards(cards.slice(0, -1));
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="relative flex flex-col gap-4">
      {cards.map((item, index) => {
        const randomNumber = Math.round(Math.random() * 10 - 5);
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
              rotateZ(${randomNumber}deg)
               translateX(${randomNumber}px) 
               translateY(${randomNumber * -1}px)
               `,
            }}
          />
        );
      })}
      <Button onClick={popCard}>Pop Card</Button>
    </div>
  );
};

export default CardsStack;
