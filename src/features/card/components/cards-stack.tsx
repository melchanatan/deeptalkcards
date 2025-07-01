"use client";
import { cn } from "@/lib/utils";
import ActiveCard from "./active-card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DomantCard from "./domant-card";

const demoContent = [
  {
    id: 1,
    title: "Card 1",
    content:
      "1งานที่ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 2,
    title: "Card 2",
    content:
      "2งานที่ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 3,
    title: "Card 3",
    content:
      "3งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 4,
    title: "Card 4",
    content:
      "4งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 5,
    title: "Card 5",
    content:
      "5งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
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
  const totalCardCount = useMemo(() => demoContent.length, []);
  const difficulty = 4; //TODO: get this from backend

  function mutateRandomRotation(cards: Card[]) {
    return cards.map((card) => {
      return {
        ...card,
        rotation: Math.round(Math.random() * 10 - 5),
      };
    });
  }

  function shuffleCards() {
    setCards(mutateRandomRotation(demoContent).sort(() => Math.random() - 0.5));
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  async function popCard() {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (cards.length <= 0) return;
    setCards(cards.slice(0, -1));
  }

  return (
    <>
      <div className="relative flex flex-col gap-4 ">
        {cards.map((item, index) => {
          const brightness = 1 - (demoContent.length - index) * 0.1;
          if (brightness <= 0) return null;

          if (index === cards.length - 1)
            return (
              <ActiveCard
                key={item.id}
                content={item.content}
                onCardPop={popCard}
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

          return (
            <DomantCard
              key={item.id}
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
      </div>

      <div
        className={cn(
          "absolute  z-[-2] w-full container font-display flex justify-between items-center text-xl",
          "top-[calc(100dvh-1rem)] translate-y-[-100%]"
        )}
      >
        <p>
          {totalCardCount - cards.length}/{totalCardCount}
        </p>
        <p>
          {Array.from({ length: difficulty }).map((_, index) => (
            <span key={index}>/</span>
          ))}
        </p>
      </div>
    </>
  );
};

export default CardsStack;
