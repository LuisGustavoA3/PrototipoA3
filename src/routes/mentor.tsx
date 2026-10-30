import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/modules/mentorias/administracao/dashboard";
import { AdminLayout } from "@/modules/mentorias/administracao/layout/AdminLayout";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Administração de Mentorias | A3 Digital" },
      {
        name: "description",
        content: "Gerencie os recursos administrativos de Mentorias.",
      },
    ],
  }),
  component: AdministracaoMentorias,
});

function AdministracaoMentorias() {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  );
}
