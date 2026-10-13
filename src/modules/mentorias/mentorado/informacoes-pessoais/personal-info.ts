/** Dados e utilitários simulados da tela de Informações Pessoais (protótipo). */

export type Profile = {
  nome: string;
  sobrenome: string;
  nascimento: string;
  sexo: string;
  estadoCivil: string;
  cpf: string;
  email: string;
  telefone: string;
  telefoneFixo: string;
  empresa: string;
  cargo: string;
  area: string;
  linkedin: string;
};

export type Address = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export const initialProfile: Profile = {
  nome: "Luis",
  sobrenome: "Gustavo",
  nascimento: "1990-04-12",
  sexo: "Masculino",
  estadoCivil: "Solteiro",
  cpf: "123.456.789-00",
  email: "luis.gustavo@a3digital.com.br",
  telefone: "(11) 98888-7766",
  telefoneFixo: "",
  empresa: "A3 Digital",
  cargo: "Gerente de Operações",
  area: "Operações",
  linkedin: "https://www.linkedin.com/in/luisgustavo",
};

export const initialAddress: Address = {
  cep: "01310-100",
  logradouro: "Avenida Paulista",
  numero: "1000",
  complemento: "Conjunto 42",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
};

export const sexOptions = ["Feminino", "Masculino", "Não informar"];
export const maritalOptions = ["Solteiro", "Casado", "Divorciado", "Viúvo"];

export const ufs = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function maskCep(value: string) {
  const d = digitsOnly(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** Máscara de celular: (00) 00000-0000 */
export function maskPhone(value: string) {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Máscara de telefone fixo: (00) 0000-0000 */
export function maskLandline(value: string) {
  const d = digitsOnly(value).slice(0, 10);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

type CepResult = Pick<Address, "logradouro" | "bairro" | "cidade" | "estado">;

/** Base local de CEPs — a integração real será definida depois. */
const cepDatabase: Record<string, CepResult> = {
  "01310100": {
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
  },
  "22041011": {
    logradouro: "Rua Barata Ribeiro",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
  },
  "30140071": {
    logradouro: "Rua da Bahia",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
  },
  "80010010": {
    logradouro: "Rua XV de Novembro",
    bairro: "Centro",
    cidade: "Curitiba",
    estado: "PR",
  },
};

/** Busca simulada de CEP (sem integração externa). */
export function lookupCep(cep: string): Promise<CepResult | null> {
  const key = digitsOnly(cep);
  return new Promise((resolve) => {
    setTimeout(() => resolve(cepDatabase[key] ?? null), 900);
  });
}
