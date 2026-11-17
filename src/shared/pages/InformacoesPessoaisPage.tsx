import { HubBreadcrumb } from "@/shared/components/HubBreadcrumb";
import { PersonalInfoForm } from "@/shared/informacoes-pessoais";

export default function InformacoesPessoais() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
        <HubBreadcrumb label="Informações Pessoais" />
        <h1 className="label-caps text-lg text-foreground">
          Informações Pessoais
        </h1>
        <PersonalInfoForm />
      </div>
    </main>
  );
}
