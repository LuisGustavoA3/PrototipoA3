import type { Address, Profile } from "../personal-info";

const profileFields: { key: keyof Profile; label: string }[] = [
  { key: "nome", label: "Nome" },
  { key: "sobrenome", label: "Sobrenome" },
  { key: "nascimento", label: "Data de nascimento" },
  { key: "sexo", label: "Sexo" },
  { key: "estadoCivil", label: "Estado civil" },
  { key: "cpf", label: "CPF" },
  { key: "email", label: "E-mail" },
  { key: "telefone", label: "Telefone celular" },
  { key: "telefoneFixo", label: "Telefone fixo" },
  { key: "empresa", label: "Empresa" },
  { key: "cargo", label: "Cargo" },
  { key: "area", label: "Área" },
  { key: "linkedin", label: "LinkedIn" },
];
const addressFields: { key: keyof Address; label: string }[] = [
  { key: "cep", label: "CEP" },
  { key: "logradouro", label: "Logradouro" },
  { key: "numero", label: "Número" },
  { key: "complemento", label: "Complemento" },
  { key: "bairro", label: "Bairro" },
  { key: "cidade", label: "Cidade" },
  { key: "estado", label: "Estado" },
];

export function PersonalInfoDetails({
  profile,
  address,
}: {
  profile: Partial<Profile>;
  address: Partial<Address>;
}) {
  return (
    <section
      className="space-y-6 rounded-md border border-border bg-card p-6"
      aria-labelledby="user-personal-info-title"
    >
      <h2 id="user-personal-info-title" className="text-lg font-semibold">
        Informações pessoais
      </h2>
      <dl className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {profileFields.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words">
              {profile[key] || "Não informado"}
            </dd>
          </div>
        ))}
      </dl>
      <h3 className="border-t border-border pt-5 font-semibold">Endereço</h3>
      <dl className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {addressFields.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words">
              {address[key] || "Não informado"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
