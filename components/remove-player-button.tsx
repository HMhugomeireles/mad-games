"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

type Props = {
  gameId: string;
  playerId: string;
  playerName?: string; // opcional, só para mostrar no texto da confirmação
};

export default function RemovePlayerButton({ gameId, playerId, playerName }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      setLoading(true);
      const res = await fetch(
        `/api/games/${gameId}/register-player?playerId=${encodeURIComponent(playerId)}`,
        { method: "DELETE" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || res.statusText);

      toast.success("Jogador removido", { description: playerName || playerId });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Falha ao remover jogador", { description: err?.message || "Erro desconhecido" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remover jogador"
          title="Remover jogador"
          // impedir que o RowLink (linha clicável) navegue
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      {/* impede bubbling para a linha clicável */}
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover jogador?</AlertDialogTitle>
          <AlertDialogDescription>
            {playerName || playerId} será removido deste jogo. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? "A remover…" : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}