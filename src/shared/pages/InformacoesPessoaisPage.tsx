import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PersonalInfoForm } from "@/shared/informacoes-pessoais";

export default function InformacoesPessoais() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
        <Link
          to="/hub"
          className="inline-flex items-center gap-2 rounded-md py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Link>
        <h1 className="label-caps text-lg text-foreground">
          Informações Pessoais
        </h1>
        <PersonalInfoForm />
      </div>
    </main>
  );
}
