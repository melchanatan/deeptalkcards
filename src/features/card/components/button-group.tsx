import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShareIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";

const buttonAnimationVariants = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.3 } },
};

const ButtonGroup = ({
  isFlipped,
  onCardPop,
}: {
  isFlipped: boolean;
  onCardPop: () => void;
}) => {
  return (
    <motion.div
      className={cn(
        "absolute bottom-[-6.5rem] w-[120%] right-0 translate-x-[-8%] left-0",
        "flex-row flex gap-2"
      )}
      variants={buttonAnimationVariants}
      transition={{
        opacity: { duration: 0.2 },
        y: { duration: 0.8 },
        ease: "easeInOut",
      }}
      initial="initial"
      animate={isFlipped ? "animate" : "initial"}
    >
      <div className="flex-1">
        <Button className="w-full" onClick={onCardPop}>
          Continue
        </Button>
      </div>
      <div>
        <Button variant="outline" size="icon">
          <ShareIcon className="size-5" weight="bold" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ButtonGroup;
