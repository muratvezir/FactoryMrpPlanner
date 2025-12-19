import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Factory <span className="text-blue-600">MRP</span> Planner
        </h1>

        <p className="mt-3 text-2xl">
          Yapay zeka destekli üretim planlama sistemi
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/materials">
            <Button size="lg" className="mt-4">Malzeme Yönetimi &rarr;</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
