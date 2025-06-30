import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GlobeIcon, InfoIcon } from "@phosphor-icons/react/dist/ssr";

const Nav = () => {
  return (
    <div className="top-4 fixed w-full container flex justify-between items-start z-[-1]">
      <Image src="/deeptalk.svg" alt="logo" width={80} height={50} />

      <div className="flex">
        <Button size="icon" variant="ghost">
          <InfoIcon size={32} weight="bold" className="size-5" />
        </Button>

        <Button size="icon" variant="ghost">
          <GlobeIcon weight="bold" className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default Nav;
