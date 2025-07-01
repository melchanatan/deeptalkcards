import Card from "@/features/card/components/card";
import CardsStack from "@/features/card/components/cards-stack";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <CardsStack />
    </main>
  );
}
