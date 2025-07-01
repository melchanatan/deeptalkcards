"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ShareIcon } from "@phosphor-icons/react";
import { motion, useMotionValue, PanInfo, useAnimation } from "motion/react";
import { s } from "motion/react-client";
import ButtonGroup from "./button-group";
import { useClickAway } from "@uidotdev/usehooks";

interface CardProps {
  cardStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

const DomantCard = ({ cardStyle, className, style }: CardProps) => {
  return (
    <div className={cn("w-[260px] sm:w-[300px]", className)} style={style}>
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
};

export default DomantCard;
