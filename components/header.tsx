import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Header() {
  return (
    <header className="container mx-auto p-6">
        <div className="flex items-center justify-between">
            <div>
              <Image
                src="/madgames.svg"
                alt="MadGames Logo"
                width={100}
                height={60}
              />
            </div>
            <div className="flex items-center justify-end p-4">
                <ThemeToggle />
            </div>
        </div>
    </header>
  );
}