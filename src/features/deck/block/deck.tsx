import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Deck = ({ deck }: { deck: any }) => {
  return (
    <Link
      href={`/deck/${deck.id}`}
      className={cn("w-full hover:scale-105 transition-all duration-300")}
    >
      <AspectRatio ratio={9 / 16} className="relative">
        <div className="card__front text-background font-display rounded-xl size-full flex flex-col justify-between border p-4 border-[#F1F1F1] items-start ">
          <Image
            src="/deeptalk-black.svg"
            alt="Card back"
            width={64}
            height={64}
            priority
            className="select-none"
          />
          <p className="text-xl">{deck.title}</p>

          <div>
            {deck.author_name && <p>by {deck.author_name}</p>}
            <p className="text-lg">
              {deck.cards_count}{" "}
              {Array.from({ length: deck.difficulty }).map((_, index) => (
                <span key={index}>/</span>
              ))}{" "}
            </p>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
};

export default Deck;
