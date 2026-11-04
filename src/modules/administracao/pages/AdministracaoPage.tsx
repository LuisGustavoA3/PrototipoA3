import { HubBreadcrumb } from "@/shared/components/HubBreadcrumb";

export default Administracao;

function Administracao() {
  return (
    <div className="min-h-screen bg-background p-6">
      <HubBreadcrumb label="Administração" />
      <h1 className="label-caps mt-6 text-lg text-foreground">Administração</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Módulo em construção. Em breve você poderá administrar usuários e
        permissões aqui.
      </p>
    </div>
  );
}
