"use client";


import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";


export default function DeleteGameButton({ gameId, disabled }: { gameId: string; disabled?: boolean }) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);


    if (disabled) {
        return (
            <Button variant="outline" disabled title="Só pode eliminar depois do jogo decorrer" className="opacity-60">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
        );
    }


    const onConfirm = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/games/${gameId}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            router.push("/admin/game");
            router.refresh();
        } catch (e: any) {
            const msg = e?.message || "Erro desconhecido";
            toast.error("Falha ao eliminar jogo", { description: msg });
        } finally {
            setLoading(false);
        }
    };


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar este jogo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação é permanente e não pode ser desfeita. Todos os dados associados a este jogo poderão ser removidos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading}>
                        {loading ? "A eliminar…" : "Confirmar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}