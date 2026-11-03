import { AdminDashboardPage } from "@/modules/administracao/dashboard";
import { AdminLayout } from "@/modules/administracao/layout/AdminLayout";

export default AdministracaoMentorias;

function AdministracaoMentorias() {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  );
}
