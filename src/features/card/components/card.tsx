"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useLockBodyScroll, useWindowScroll } from "@uidotdev/usehooks";
import { ShareIcon } from "@phosphor-icons/react";

interface CardProps {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
}
const Card = ({ frontContent = "Front of Card", className }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Use useEffect to handle scroll locking with vanilla JS
  useEffect(() => {
    if (isFlipped) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        // Remove the styles and restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";

        // Scroll back to the original position
        window.scrollTo(0, 0);
      };
    }
  }, [isFlipped]);

  const flipCard = () => {
    // Scroll to top first
    scrollTo({ top: 0, behavior: "smooth" });
    // Then flip the card
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn(" w-[300px]", className)} onClick={flipCard}>
      <AspectRatio ratio={9 / 16} className="relative">
        <div
          className={cn(
            "card__content h-full w-full text-center relative rotate-z-[3deg] p-20 transition-transform duration-1000 text-white font-bold",
            isFlipped ? "rotate-y-180 scale-125 rotate-z-0" : ""
          )}
        >
          {/* Front of card */}
          <div className="card__front absolute rounded-xl top-0 bottom-0 right-0 left-0 p-5 flex border border-[#F1F1F1] items-center justify-center">
            <Image
              src="/deeptalk-red.svg"
              alt="Card back"
              width={124}
              height={100}
            />
          </div>

          {/* Back of card */}
          <div className="card__back absolute rounded-xl top-0 bottom-0 right-0 left-0 p-5 flex items-center justify-start">
            <Image
              src="/deeptalk.svg"
              alt="Card back"
              width={80}
              height={50}
              className="absolute top-6 left-5 select-none"
            />
            <h2 className="font-normal text-[clamp(1.5rem,2.5vw,2rem)] text-start">
              {frontContent}
            </h2>
          </div>
        </div>
        <div
          className={cn(
            "absolute bottom-[-7rem] w-[125%] right-0 translate-x-[-10%] left-0 ",
            isFlipped ? "flex" : "hidden",
            " flex-row gap-2"
          )}
        >
          <Button className="flex-1">Continue</Button>
          <Button variant="outline" size="icon">
            <ShareIcon className="size-5" weight="bold" />
          </Button>
        </div>
      </AspectRatio>

      {isFlipped && <BackgroundBlur />}
    </div>
  );
};

const BackgroundBlur = () => {
  return (
    <div className="fixed z-[-1] size-full top-0 bottom-0 right-0 left-0 bg-background/10 backdrop-blur-sm" />
  );
};
export default Card;
