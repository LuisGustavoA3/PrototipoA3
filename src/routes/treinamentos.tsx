import { HubBreadcrumb } from "@/shared/components/HubBreadcrumb";

export default Treinamentos;

function Treinamentos() {
  return (
    <div className="min-h-screen bg-background p-6">
      <HubBreadcrumb label="Treinamentos" />
      <h1 className="label-caps mt-6 text-lg text-foreground">Treinamentos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Módulo em construção. Em breve você poderá gerenciar turmas e
        capacitações aqui.
      </p>
    </div>
  );
}
