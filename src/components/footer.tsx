import Link from "next/link";
import { Button } from "./ui/button";
import { CoffeeIcon } from "@phosphor-icons/react/dist/ssr";

function Footer() {
  return (
    <footer className="font-display text-xl container py-6 flex flex-col items-start gap-3">
      <div className="text-start max-w-[300px] space-y-6">
        <p>
          built with :heart: <br />
          by{" "}
          <Link href="https://chanatan.com" className="text-accent ">
            melchanatan
          </Link>
          <br />
          <br />
          if you like what I do consider sponsoring me by buying me a coffee
          {" :^)"}
        </p>
        <Button className="w-full">
          <CoffeeIcon size={24} weight="fill" className="size-5" />
          buy me coffee
        </Button>
      </div>
    </footer>
  );
}

export default Footer;
