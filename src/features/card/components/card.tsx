"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ShareIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { s } from "motion/react-client";
import ButtonGroup from "./button-group";
import { useClickAway } from "@uidotdev/usehooks";

interface CardProps {
  content?: React.ReactNode;
  backContent?: React.ReactNode;
  cardClassName?: string;
  cardStyle?: React.CSSProperties;
  className?: string;
  isActiveCard?: boolean;
  style?: React.CSSProperties;
  onCardPop: () => void;
}

const Card = ({
  content = "Front of Card",
  onCardPop,
  cardClassName,
  cardStyle,
  className,
  isActiveCard,
  style,
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";

        window.scrollTo(0, 0);
      };
    }
  }, [isFlipped]);

  const flipCard = () => {
    scrollTo({ top: 0, behavior: "smooth" });
    setIsFlipped(true);
  };

  const [isPopping, setIsPopping] = useState(false);

  function handlePopCard() {
    setIsPopping(true);
    onCardPop();
  }

  const ref = useClickAway<HTMLDivElement>((e) => {
    setIsFlipped(false);
  });

  if (!isActiveCard)
    return (
      <div
        className={cn("w-[260px] sm:w-[300px]", className)}
        style={style}
        onClick={flipCard}
      >
        <AspectRatio ratio={9 / 16} className="relative">
          <div
            style={cardStyle}
            className="card__front absolute rounded-xl top-0 bottom-0 right-0 left-0 p-5 flex border border-[#F1F1F1] items-center justify-center"
          >
            <Image
              src="/deeptalk-red.svg"
              alt="Card back"
              width={124}
              height={100}
              className="select-none"
            />
          </div>
        </AspectRatio>
      </div>
    );

  return (
    <>
      <motion.div
        ref={ref}
        drag
        className={cn("w-[260px] sm:w-[300px]")}
        onClick={flipCard}
        dragSnapToOrigin
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        animate={
          isPopping
            ? {
                y: [-20, -900],
                x: [0, 600],
                scale: [1.1, 0.6],
                rotateZ: [0, 30],
              }
            : {}
        }
        dragMomentum={true}
        transition={{
          duration: 0.5,
        }}
      >
        <AspectRatio ratio={9 / 16} className="relative">
          <div
            className={cn(
              cardClassName,
              "card__content h-full w-full text-center relative p-20 text-white font-bold",
              "ease-out transition-transform duration-1000",
              isFlipped ? "rotate-y-180 scale-[120%] rotate-z-0 " : ""
            )}
            style={{
              ...cardStyle,
              ...(isFlipped && {
                transform: "rotateY(180deg)",
              }),
            }}
          >
            {/* Front of card */}
            <div className="card__front absolute rounded-xl top-0 bottom-0 right-0 left-0 p-5 flex border border-[#F1F1F1] items-center justify-center">
              <Image
                src="/deeptalk-red.svg"
                alt="Card back"
                width={124}
                height={100}
                draggable={false}
                className="select-none"
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
              <h2 className="select-none font-normal text-[clamp(1.5rem,2.5vw,2rem)] text-start">
                {content}
              </h2>
            </div>
          </div>
        </AspectRatio>
        <ButtonGroup
          isShowing={isFlipped}
          isDragging={isDragging}
          onCardPop={handlePopCard}
        />
      </motion.div>
      <BackgroundBlur isShowing={isFlipped && !isPopping} />
    </>
  );
};

const BackgroundBlur = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <motion.div
      className="fixed z-[-1] size-full top-0 bottom-0 right-0 left-0 bg-background/10 backdrop-blur-sm"
      initial={{ opacity: 0, pointerEvents: "none" }}
      animate={{ opacity: isShowing ? 1 : 0, pointerEvents: "auto" }}
      transition={{ duration: 0.5 }}
    />
  );
};
export default Card;
