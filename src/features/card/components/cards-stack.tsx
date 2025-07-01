"use client";
import { cn } from "@/lib/utils";
import Card from "./card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const demoContent = [
  {
    id: 1,
    title: "Card 1",
    content:
      "งานที่ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 2,
    title: "Card 2",
    content:
      "งานที่ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 3,
    title: "Card 3",
    content:
      "งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 4,
    title: "Card 4",
    content:
      "งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
  },
  {
    id: 5,
    title: "Card 5",
    content:
      "งานที้ฉันทำอยู่ตอนนี้ กำลังหล่อหลอมฉันเป็นคนแบบไหน — และนั่นคือคนที่ฉันอยากเป็นหรือเปล่า?",
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

  async function popCard() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (cards.length <= 0) return;
    setCards(cards.slice(0, -1));
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <>
      <div className="relative flex flex-col gap-4 ">
        {cards.map((item, index) => {
          // const randomNumber = Math.round(Math.random() * 10 - 5);
          const brightness = 1 - (demoContent.length - index) * 0.1;
          if (brightness <= 0) return null;

          return (
            <Card
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
        })}
      </div>

      <div
        className={cn(
          "absolute  z-[-2] w-full container font-display flex justify-between items-center text-xl",
          "top-[calc(100dvh-1rem)] translate-y-[-100%]"
          // "bottom-4"
        )}
      >
        <p>0/52</p>
        <p>////</p>
      </div>
    </>
  );
};

export default CardsStack;
