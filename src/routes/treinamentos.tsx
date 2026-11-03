import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default Treinamentos;

function Treinamentos() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link
        to="/hub"
        className="label-caps inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Voltar ao hub
      </Link>
      <h1 className="label-caps mt-6 text-lg text-foreground">Treinamentos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Módulo em construção. Em breve você poderá gerenciar turmas e
        capacitações aqui.
      </p>
    </div>
  );
}
