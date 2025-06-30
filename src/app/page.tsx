import Card from "@/features/card/components/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Card />

      <div className="absolute bottom-4 w-full container font-display flex justify-between items-center text-xl">
        <p>0/52</p>
        <p>////</p>
      </div>
    </main>
  );
}
