import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GlobeIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr";
import RulebookButton from "./rulebook-button";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="top-4 fixed left-0 right-0 container flex justify-between items-start">
      <Link href="/">
        <Image src="/deeptalk.svg" alt="logo" width={80} height={50} />
      </Link>

      <div className="flex">
        <RulebookButton />
        {/* <Button size="icon" variant="ghost">
          <GlobeIcon weight="bold" className="size-5" />
        </Button> */}
      </div>
    </div>
  );
};

export default Nav;
