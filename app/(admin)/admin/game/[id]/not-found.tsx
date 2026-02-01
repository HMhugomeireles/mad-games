import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center space-y-6 text-center px-4">
      {/* Ícone com círculo de fundo */}
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* Textos Principais */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground max-w-[500px]">
          Desculpa, não conseguimos encontrar a página que procuras. Pode ter sido removida, 
          renomeada ou o link pode estar incorreto.
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-2 min-w-[300px] justify-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/admin/game">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Jogos
          </Link>
        </Button>
        
        <Button asChild>
          <Link href="/admin">
            <Home className="mr-2 h-4 w-4" />
            Ir para a Home
          </Link>
        </Button>
      </div>
    </div>
  );
}