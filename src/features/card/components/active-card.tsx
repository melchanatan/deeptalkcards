"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ShareIcon } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  PanInfo,
  useAnimation,
  AnimatePresence,
} from "motion/react";
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

const ActiveCard = ({
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
  const [isPopping, setIsPopping] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);

  // Motion values for tracking drag velocity
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

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
    if (isDragging) return;
    scrollTo({ top: 0, behavior: "smooth" });
    setIsFlipped(true);
  };

  function handlePopCard() {
    setIsPopping(true);
    onCardPop();
  }

  const ref = useClickAway<HTMLDivElement>((e) => {
    if (!isDragging && !isThrowing) {
      setIsFlipped(false);
    }
  });

  // Handle card throw with momentum
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    // Get window dimensions to calculate throw direction
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Set velocity threshold for throw detection
    const velocityThreshold = 300;

    // Check if throw velocity is high enough
    if (
      Math.abs(info.velocity.x) > velocityThreshold ||
      Math.abs(info.velocity.y) > velocityThreshold
    ) {
      setIsThrowing(true);

      // Calculate throw direction based on velocity
      // Multiply by larger values for more dramatic throw effect
      const throwX =
        info.velocity.x > 0 ? windowWidth * 1.5 : -windowWidth * 1.5;
      const throwY =
        info.velocity.y > 0 ? windowHeight * 1.5 : -windowHeight * 1.5;

      // Calculate rotation based on horizontal velocity
      const rotation = info.velocity.x * 0.05;

      // Animate the card flying off screen
      controls.set({
        scale: 0.5,
      });

      controls.start({
        x: throwX,
        y: throwY,
        rotate: rotation,
        opacity: 1,
        scale: 0.5,
        transition: {
          duration: 0.6,
          type: "spring",
          damping: 10,
          stiffness: 50,
          velocity:
            Math.max(Math.abs(info.velocity.x), Math.abs(info.velocity.y)) *
            0.01,
        },
      });

      onCardPop();

      return;
    }

    // If not thrown with enough force, snap back to origin
    controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <>
      <motion.div
        ref={ref}
        drag
        className={cn("w-[260px] sm:w-[300px] ")}
        onClick={flipCard}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.6}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={
          isPopping
            ? {
                y: [-20, -900],
                x: [0, 600],
                scale: [1.1, 0.6],
                rotateZ: [0, 30],
              }
            : controls
        }
        style={{ x, y }}
        whileDrag={{ cursor: "grabbing", scale: 1.02 }}
        transition={{
          duration: 0.5,
        }}
      >
        <AspectRatio ratio={9 / 16} className="relative">
          <div
            className={cn(
              cardClassName,
              "card__content h-full w-full text-center relative shadow-xl p-20 text-white font-bold",
              "ease-out transition-transform duration-1000 z-20",
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
                className="absolute top-6 left-5 select-none w-[64px] sm:w-[72px]"
              />
              <h2 className="select-none font-normal text-[clamp(1.5rem,2.5vw,1.75rem)] text-start">
                {content}
              </h2>
            </div>
          </div>
        </AspectRatio>
        <ButtonGroup
          isShowing={isFlipped}
          isDragging={isDragging || isThrowing}
          onCardPop={handlePopCard}
        />
      </motion.div>
      <BackgroundBlur isShowing={isFlipped && !isPopping && !isThrowing} />
    </>
  );
};

const BackgroundBlur = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          className="fixed z-[2] size-full top-0 bottom-0 right-0 left-0 bg-background/10 backdrop-blur-sm"
          initial={{ opacity: 0, pointerEvents: "none" }}
          animate={{ opacity: isShowing ? 1 : 0, pointerEvents: "auto" }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
};
export default ActiveCard;
