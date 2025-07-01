"use client";
import { cn } from "@/lib/utils";
import ActiveCard from "./active-card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DormantCard from "./dormant-card";
import {
  ArrowLeftIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";

interface Card {
  id: number;
  title: string;
  content_us: string;
  content_th?: string;
  rotation?: number;
}

const CardsStack = ({
  cards,
  difficulty,
}: {
  cards: any;
  difficulty: number;
}) => {
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const totalCardCount = useMemo(() => cards.length, []);

  function mutateRandomRotation(cards: Card[]) {
    return cards.map((card) => {
      return {
        ...card,
        rotation: Math.round(Math.random() * 10 - 5),
      };
    });
  }

  function shuffleCards() {
    setCurrentCards(
      mutateRandomRotation(cards).sort(() => Math.random() - 0.5)
    );
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  async function popCard() {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (cards.length <= 0) return;
    setCurrentCards(cards.slice(0, -1));
  }

  return (
    <>
      <div className="relative flex flex-col gap-4 ">
        {currentCards.map((item, index) => {
          // Calculate brightness - second card (index === cards.length - 2) will be 100%
          let brightness = 1 - (cards.length - index) * 0.02;
          if (index === currentCards.length - 2) {
            brightness = 1;
          }

          if (brightness <= 0) return null;
          if (index === currentCards.length - 1)
            return (
              <ActiveCard
                key={item.id}
                content={item.content_us}
                onCardPop={popCard}
                isActiveCard={index === currentCards.length - 1}
                className={cn("absolute top-0 left-0")}
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
            <DormantCard
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

      {/* return button */}
      <AnimatePresence>
        {currentCards.length <= 0 && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.3 }}
            className="absolute text-primary/40 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full flex justify-center"
          >
            <button
              onClick={shuffleCards}
              className="flex font-display text-2xl flex-col items-center gap-2 p-2"
            >
              <ArrowClockwiseIcon className="size-14" />
              <p>Play again</p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* additional info */}
      <div
        className={cn(
          "absolute  z-[-2] w-full container font-display flex justify-between items-center text-xl",
          "top-[calc(100dvh-1rem)] translate-y-[-100%]"
        )}
      >
        <p>
          {totalCardCount - currentCards.length}/{totalCardCount}
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
