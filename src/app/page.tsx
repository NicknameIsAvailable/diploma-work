import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Link href="/schedule">
        <Button>Посмотреть расписание</Button>
      </Link>
    </div>
  );
}
