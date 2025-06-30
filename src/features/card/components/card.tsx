"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

interface CardProps {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
}

const Card = ({ frontContent = "Front of Card", className }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("relative w-[300px] ", className)} onClick={flipCard}>
      <AspectRatio ratio={9 / 16}>
        <div
          className={cn(
            "card__content h-full  w-full text-center relative p-20 transition-transform duration-1000 text-white font-bold",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* Front of card */}
          <div className="card__front absolute rounded-xl top-0 bottom-0 right-0 left-0 p-8 flex items-center justify-center">
            <Image
              src="/deeptalk.svg"
              alt="Card back"
              width={80}
              height={50}
              className="absolute top-6 left-5 select-none"
            />
            <h2>{frontContent}</h2>
          </div>

          {/* Back of card */}
          <div className="card__back absolute rounded-xl top-0 bottom-0 right-0 left-0 p-8 border border-[#F1F1F1]  flex items-center justify-center">
            <Image
              src="/deeptalk-red.svg"
              alt="Card back"
              width={124}
              height={100}
            />
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

export default Card;
