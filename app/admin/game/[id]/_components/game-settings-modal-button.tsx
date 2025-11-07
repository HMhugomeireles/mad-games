"use client";


import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import GameSettingsForm from "./game-settings-form";


export default function GameSettingsModalButton({
    gameId,
    initialSettings,
}: {
    gameId: string;
    initialSettings?: {
        groups?: { id?: string; groupName: string; groupColor: string }[];
        maxplayers?: number | null;
        deadWaitTimeSeconds?: number | null;
        respawnTimeSeconds?: number | null;
        respawnType?: "players-number" | "time" | "other" | null;
        respawnMaxPlayers?: number | null;
    };
}) {
    const [open, setOpen] = React.useState(false);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" title="Modificar definições do jogo">
                    <Settings2 className="mr-2 h-4 w-4" /> Definições
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Definições do jogo</DialogTitle>
                    <DialogDescription>Configure os grupos que serão usados neste jogo.</DialogDescription>
                </DialogHeader>


                <GameSettingsForm
                    gameId={gameId}
                    initialSettings={initialSettings ?? {}}
                    onSaved={() => setOpen(false)}
                />


                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}