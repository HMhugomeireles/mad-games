"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Cpu, Users, Menu, MapIcon } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";


// (Opcional) se tiveres o ThemeToggle que te passei antes
// import { ThemeToggle } from "@/components/theme-toggle";


function cn(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}


function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const pathname = usePathname();
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
        <Link href={href} className={cn(
            "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            active ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
        )}>
            <Icon className="h-4 w-4" />
            <span className="capitalize">{label}</span>
        </Link>
    );
}


export default function AdminMenu() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto grid grid-cols-3 items-center py-3">
                {/* Esquerda: nav (desktop) + menu (mobile) */}
                <div className="flex items-center gap-2">
                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/admin/game" label="games" icon={Gamepad2} />
                        <NavLink href="/admin/device" label="devices" icon={Cpu} />
                        <NavLink href="/admin/player" label="players" icon={Users} />
                        <NavLink href="/admin/field-map" label="field-map" icon={MapIcon} />
                    </nav>


                    {/* Mobile menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 grid gap-1">
                                <NavLink href="/admin/game" label="games" icon={Gamepad2} />
                                <NavLink href="/admin/device" label="devices" icon={Cpu} />
                                <NavLink href="/admin/player" label="players" icon={Users} />
                                <NavLink href="/admin/field-map" label="field-map" icon={MapIcon} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>


                {/* Centro: título sempre centrado */}
                <div className="justify-self-center text-center">
                    <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
                </div>


                {/* Direita: ações (ex.: theme toggle, user, etc.) */}
                <div className="justify-self-end">
                    {/* <ThemeToggle /> */}
                </div>
            </div>
        </header>
    );
}