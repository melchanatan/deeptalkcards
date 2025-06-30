import Card from "@/features/card/components/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Card />

      <div className="absolute bottom-0 left-0 right-0 text-center text-white text-4xl font-display">
        The Future of Work is Here
      </div>
    </main>
  );
}
