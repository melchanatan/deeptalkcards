import { BookOpenIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const RulebookButton = () => {
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" variant="ghost">
            <BookOpenIcon size={32} weight="bold" className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-display text-xl">Rulebook</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-4 container">
            <div className="mb-4 flex flex-row gap-2 items-center font-medium">
              <UsersIcon size={24} weight="bold" className="size-5" />
              2–6 players (best with 3+)
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Turn sequence</h4>
              <ol className="space-y-3 list-decimal pl-6">
                <li>On your turn, draw the top card and read it aloud.</li>
                <li>
                  You must answer honestly, or you may "pass" — but you only get
                  one pass per game.
                </li>
                <li>
                  After answering, choose one other player to answer the same
                  question.
                </li>
                <li>That player then takes the next turn.</li>
              </ol>
            </div>

            <p className="text-primary/80">
              You can follow any rule you want, but the goal is to get to know
              each other better :)
            </p>
          </div>
          <DrawerFooter>
            <Button className="container">I understand</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RulebookButton;
