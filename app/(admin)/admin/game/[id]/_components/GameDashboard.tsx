"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    ArrowLeft, BarChart3, Trash2, Users, Settings, Smartphone, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GamePlayerTab } from "./GamePlayerTab";
import { GameSettingsTab } from "./GameSettingsTab";
import { GameDeviceTab } from "./GameDeviceTab";
import { GameDoc } from "@/lib/db/models/game";
import { DeviceDoc } from "@/lib/db/models/device";
import { PlayerDoc } from "@/lib/db/models/player";
import { GameAttributesTab } from "./GameAttributesTab";

interface GameDashboardProps {
    game: GameDoc;
    playersList: PlayerDoc[];
}

const sidebarItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "players", label: "Players", icon: Users },
    { id: "devices", label: "Devices", icon: Smartphone },
    { id: "attributes", label: "Attributes", icon: Tag },
];

export function GameDashboard({ game, playersList }: GameDashboardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const activeTab = searchParams.get("tab") || "settings";

    const [isDeleting, setIsDeleting] = useState(false);

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabId);
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleDeleteGame = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/games/${game._id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao apagar");
            toast.success("Jogo eliminado com sucesso");
            router.push("/admin/game");
            router.refresh();
        } catch (error) {
            toast.error("Falha ao eliminar jogo");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "players":
                return (
                    <GamePlayerTab
                        gameId={game._id}
                        initialPlayersList={playersList}
                        initialGameData={game}
                    />
                )
            case "devices":
                return (
                    <GameDeviceTab
                        gameId={game._id}
                        initialGameData={game}
                    />
                );
            case "attributes":
                return (
                    <GameAttributesTab 
                        gameId={game._id} 
                        initialGame={game} 
                    />
                );
            case "settings":
            default:
                return (
                    <GameSettingsTab
                        gameData={game}
                    />
                )
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">{game.name}</h1>
                    <div className="text-muted-foreground flex flex-col gap-1 sm:flex-row sm:gap-4 sm:items-center">
                        {/* Exibe dados reais vindos do servidor */}
                        <p className="font-medium text-foreground">{game.fieldMapId || "Local não definido"}</p>
                        <span className="hidden sm:block text-border">•</span>
                        <p>{game.date ? new Date(game.date).toLocaleDateString("pt-PT") : "Data não definida"} - {game.status}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/game")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Lista
                    </Button>

                    <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/game/${game._id}/results`)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Resultados
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tens a certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação irá apagar permanentemente o jogo <span className="font-bold">{game.name}</span>.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteGame} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                    {isDeleting ? "A apagar..." : "Sim, eliminar"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Separator />

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 lg:gap-10 items-start">
                {/* Menu Lateral */}
                <nav className="flex flex-col space-y-1 bg-muted/30 p-2 rounded-lg border">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                                "justify-start w-full text-left font-normal h-10 cursor-pointer",
                                activeTab === item.id
                                    ? "bg-white dark:bg-muted shadow-sm font-medium text-primary hover:bg-white"
                                    : "hover:bg-transparent hover:underline text-muted-foreground"
                            )}
                            onClick={() => handleTabChange(item.id)}
                        >
                            <item.icon className="mr-2 h-4 w-4 shrink-0" />
                            {item.label}
                        </Button>
                    ))}
                </nav>

                {/* Conteúdo Principal */}
                <main className="flex-1 border rounded-lg p-6 min-h-[500px] shadow-sm bg-card text-card-foreground">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}