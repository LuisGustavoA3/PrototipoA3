import { PersonalInfoDetails } from "@/shared/informacoes-pessoais";
import { useParams } from "react-router-dom";
import { ManagementShell } from "../components/ManagementShell";
import { demoPeople, companyName } from "../lib/development-demo";

export default function UsuarioPage() {
  const { userId } = useParams();
  const person = demoPeople.find((item) => item.id === userId);
  if (!person)
    return (
      <ManagementShell
        title="Usuário não encontrado"
        description="Confira o endereço ou volte à listagem."
      >
        {null}
      </ManagementShell>
    );
  return (
    <ManagementShell
      title={person.name}
      description="Informações da conta selecionada."
    >
      <PersonalInfoDetails
        profile={{
          nome: person.name.split(" ")[0]!,
          sobrenome: person.name.split(" ").slice(1).join(" "),
          email: person.email,
          empresa: companyName(person.companyId),
        }}
        address={{}}
      />
      <section className="space-y-2 rounded-md border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Acesso</h2>
        <dl>
          <dt className="text-sm text-muted-foreground">Perfil no Portal</dt>
          <dd>{person.role}</dd>
        </dl>
      </section>
    </ManagementShell>
  );
}
