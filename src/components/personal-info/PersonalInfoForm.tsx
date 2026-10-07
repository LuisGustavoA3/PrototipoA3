import { useEffect, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { AlertTriangle, Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AvatarUploader } from "@/components/personal-info/AvatarUploader";
import {
  Field,
  PasswordField,
  SelectField,
  TextField,
} from "@/components/personal-info/Field";
import {
  digitsOnly,
  initialAddress,
  initialProfile,
  lookupCep,
  maritalOptions,
  maskCep,
  maskLandline,
  maskPhone,
  sexOptions,
  ufs,
  type Address,
  type Profile,
} from "@/lib/personal-info";

type CepStatus = "idle" | "searching" | "found" | "notfound";

/** Ordem visual dos campos obrigatórios (usada na validação de baixo para cima). */
const requiredOrder = [
  "nome",
  "sobrenome",
  "nascimento",
  "sexo",
  "estadoCivil",
  "telefone",
  "cargo",
  "area",
  "cep",
  "logradouro",
  "numero",
  "bairro",
  "cidade",
  "estado",
] as const;

const labels: Record<string, string> = {
  nome: "Nome",
  sobrenome: "Sobrenome",
  nascimento: "Data de nascimento",
  sexo: "Sexo",
  estadoCivil: "Estado civil",
  telefone: "Telefone",
  cargo: "Cargo",
  area: "Área",
  cep: "CEP",
  logradouro: "Logradouro",
  numero: "Número",
  bairro: "Bairro",
  cidade: "Cidade",
  estado: "Estado",
};

export function PersonalInfoForm() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [address, setAddress] = useState<Address>(initialAddress);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flashing, setFlashing] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [passwordStepOpen, setPasswordStepOpen] = useState(false);
  const [stepPassword, setStepPassword] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastLookup = useRef<string>(digitsOnly(initialAddress.cep));

  const dirty =
    JSON.stringify(profile) !== JSON.stringify(initialProfile) ||
    JSON.stringify(address) !== JSON.stringify(initialAddress) ||
    avatar !== null ||
    newPassword !== "" ||
    confirmPassword !== "";

  const blocker = useBlocker({
    shouldBlockFn: () => dirty,
    enableBeforeUnload: () => dirty,
    withResolver: true,
  });

  useEffect(() => {
    if (!flashing) return;
    const timer = setTimeout(() => setFlashing(null), 2600);
    return () => clearTimeout(timer);
  }, [flashing]);

  const setField = (key: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setAddressField = (key: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleCep = async (raw: string) => {
    const masked = maskCep(raw);
    setAddressField("cep", masked);
    const digits = digitsOnly(masked);

    if (digits.length < 8) {
      setCepStatus("idle");
      return;
    }
    if (digits === lastLookup.current && cepStatus === "found") return;

    lastLookup.current = digits;
    setCepStatus("searching");
    const result = await lookupCep(digits);
    if (!result) {
      setCepStatus("notfound");
      return;
    }
    setCepStatus("found");
    setAddress((prev) => ({ ...prev, ...result }));
    setErrors((prev) => ({
      ...prev,
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));
  };

  const values: Record<string, string> = { ...profile, ...address };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const key of requiredOrder) {
      if (!values[key]?.trim()) next[key] = "Campo obrigatório.";
    }
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        next["newPassword"] = "A nova senha deve ter no mínimo 8 caracteres.";
      }
      if (newPassword !== confirmPassword) {
        next["confirmPassword"] = "As senhas não coincidem.";
      }
    }
    return next;
  };

  const handleUpdate = () => {
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      // Validação de baixo para cima: primeiro campo pendente a partir do final.
      const order = [...requiredOrder, "newPassword", "confirmPassword"];
      const pending = [...order].reverse().find((key) => next[key]);
      setFormMessage(
        Object.keys(next).some((k) => requiredOrder.includes(k as never))
          ? "há campos obrigatórios não preenchidos"
          : "revise os campos de senha",
      );
      if (pending) {
        fieldRefs.current[pending]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setFlashing(pending);
      }
      return;
    }

    setFormMessage(null);
    setConfirmOpen(true);
  };

  const finishSave = () => {
    if (!stepPassword.trim()) {
      setStepError("Informe sua senha atual para concluir.");
      return;
    }
    setStepError(null);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordStepOpen(false);
      setSuccessOpen(true);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setStepPassword("");
    }, 900);
  };

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    fieldRefs.current[key] = el;
  };

  const fieldProps = (key: string) => ({
    id: key,
    error: errors[key] || undefined,
    flashing: flashing === key,
    containerRef: registerRef(key),
  });

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Perfil */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="label-caps text-sm text-foreground">Perfil</h2>
          <div className="mt-5">
            <AvatarUploader value={avatar} onChange={setAvatar} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-6">
            <TextField
              {...fieldProps("nome")}
              label="Nome"
              required
              className="sm:col-span-3"
              value={profile.nome}
              onChange={(v) => setField("nome", v)}
            />
            <TextField
              {...fieldProps("sobrenome")}
              label="Sobrenome"
              required
              className="sm:col-span-3"
              value={profile.sobrenome}
              onChange={(v) => setField("sobrenome", v)}
            />
            <TextField
              {...fieldProps("nascimento")}
              label="Data de nascimento"
              required
              type="date"
              className="sm:col-span-2"
              value={profile.nascimento}
              onChange={(v) => setField("nascimento", v)}
            />
            <SelectField
              {...fieldProps("sexo")}
              label="Sexo"
              required
              className="sm:col-span-2"
              options={sexOptions}
              value={profile.sexo}
              onChange={(v) => setField("sexo", v)}
            />
            <SelectField
              {...fieldProps("estadoCivil")}
              label="Estado civil"
              required
              className="sm:col-span-2"
              options={maritalOptions}
              value={profile.estadoCivil}
              onChange={(v) => setField("estadoCivil", v)}
            />
            <TextField
              {...fieldProps("cpf")}
              label="CPF"
              required
              locked
              className="sm:col-span-2"
              value={profile.cpf}
              onChange={() => {}}
            />
            <TextField
              {...fieldProps("email")}
              label="E-mail"
              required
              locked
              className="sm:col-span-4"
              value={profile.email}
              onChange={() => {}}
            />
            <TextField
              {...fieldProps("telefone")}
              label="Telefone"
              required
              inputMode="tel"
              className="sm:col-span-2"
              value={profile.telefone}
              onChange={(v) => setField("telefone", maskPhone(v))}
            />
            <TextField
              {...fieldProps("telefoneFixo")}
              label="Telefone fixo"
              inputMode="tel"
              className="sm:col-span-2"
              value={profile.telefoneFixo}
              onChange={(v) => setField("telefoneFixo", maskLandline(v))}
            />
            <TextField
              {...fieldProps("empresa")}
              label="Empresa"
              required
              locked
              className="sm:col-span-2"
              value={profile.empresa}
              onChange={() => {}}
            />
            <TextField
              {...fieldProps("cargo")}
              label="Cargo"
              required
              className="sm:col-span-3"
              value={profile.cargo}
              onChange={(v) => setField("cargo", v)}
            />
            <TextField
              {...fieldProps("area")}
              label="Área"
              required
              className="sm:col-span-3"
              value={profile.area}
              onChange={(v) => setField("area", v)}
            />
            <TextField
              {...fieldProps("linkedin")}
              label="LinkedIn"
              type="url"
              inputMode="url"
              placeholder="https://www.linkedin.com/in/seu-perfil"
              className="sm:col-span-6"
              value={profile.linkedin}
              onChange={(v) => setField("linkedin", v)}
            />
          </div>
        </section>

        {/* Endereço */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="label-caps text-sm text-foreground">Endereço</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <TextField
                {...fieldProps("cep")}
                label="CEP"
                required
                inputMode="numeric"
                maxLength={9}
                placeholder="00000-000"
                value={address.cep}
                onChange={(v) => void handleCep(v)}
              />
              <div aria-live="polite" className="mt-1.5 min-h-5 text-xs">
                {cepStatus === "searching" && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    Buscando endereço...
                  </span>
                )}
                {cepStatus === "found" && (
                  <span className="flex items-center gap-1.5 text-primary">
                    <Check className="size-3.5" aria-hidden />
                    Endereço encontrado.
                  </span>
                )}
                {cepStatus === "notfound" && (
                  <span className="flex items-center gap-1.5 text-destructive">
                    <AlertTriangle className="size-3.5" aria-hidden />
                    CEP não encontrado.
                  </span>
                )}
              </div>
            </div>

            <TextField
              {...fieldProps("logradouro")}
              label="Logradouro"
              required
              className="sm:col-span-4"
              value={address.logradouro}
              onChange={(v) => setAddressField("logradouro", v)}
            />
            <TextField
              {...fieldProps("numero")}
              label="Número"
              required
              inputMode="numeric"
              maxLength={6}
              className="sm:col-span-1"
              value={address.numero}
              onChange={(v) => setAddressField("numero", digitsOnly(v))}
            />
            <TextField
              {...fieldProps("complemento")}
              label="Complemento"
              className="sm:col-span-2"
              value={address.complemento}
              onChange={(v) => setAddressField("complemento", v)}
            />
            <TextField
              {...fieldProps("bairro")}
              label="Bairro"
              required
              className="sm:col-span-3"
              value={address.bairro}
              onChange={(v) => setAddressField("bairro", v)}
            />
            <TextField
              {...fieldProps("cidade")}
              label="Cidade"
              required
              className="sm:col-span-4"
              value={address.cidade}
              onChange={(v) => setAddressField("cidade", v)}
            />
            <SelectField
              {...fieldProps("estado")}
              label="Estado"
              required
              className="sm:col-span-2"
              options={ufs}
              placeholder="UF"
              value={address.estado}
              onChange={(v) => setAddressField("estado", v)}
            />
          </div>
        </section>

        {/* Alterar senha */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="label-caps text-sm text-foreground">Alterar senha</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Opcional. Preencha apenas se quiser trocar sua senha.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <PasswordField
                {...fieldProps("newPassword")}
                label="Nova senha"
                autoComplete="new-password"
                value={newPassword}
                onChange={(v) => {
                  setNewPassword(v);
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
              />
              <p
                className={
                  newPassword.length >= 8
                    ? "mt-1.5 flex items-center gap-1.5 text-xs text-primary"
                    : "mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"
                }
              >
                <Check className="size-3.5" aria-hidden />
                Mínimo de 8 caracteres
              </p>
            </div>
            <PasswordField
              {...fieldProps("confirmPassword")}
              label="Confirme a sua nova senha"
              autoComplete="new-password"
              className="sm:col-span-3"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
          </div>
        </section>

        {/* Salvar alterações */}
        <section className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="label-caps text-sm text-foreground">
            Salvar alterações
          </h2>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
            <PasswordField
              id="currentPassword"
              label="Informe sua senha atual"
              autoComplete="current-password"
              className="sm:max-w-xs sm:flex-1"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <Button type="button" onClick={handleUpdate} className="sm:w-40">
              <Save className="size-4" />
              Atualizar
            </Button>
          </div>

          {formMessage && (
            <p
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              <AlertTriangle className="size-4" aria-hidden />
              {formMessage}
            </p>
          )}
        </section>
      </div>

      {/* Confirmação de salvamento */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              tem certeza que quer salvar as alterações?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Em seguida você informará a senha atual para concluir a
              atualização.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setStepPassword(currentPassword);
                setStepError(null);
                setPasswordStepOpen(true);
              }}
            >
              Sim, salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Etapa de senha atual */}
      <Dialog open={passwordStepOpen} onOpenChange={setPasswordStepOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirme sua senha atual</DialogTitle>
            <DialogDescription>
              Necessária para concluir a atualização das informações.
            </DialogDescription>
          </DialogHeader>
          <PasswordField
            id="stepPassword"
            label="Senha atual"
            required
            autoComplete="current-password"
            error={stepError ?? undefined}
            value={stepPassword}
            onChange={(v) => {
              setStepPassword(v);
              setStepError(null);
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPasswordStepOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={finishSave} disabled={saving}>
              {saving && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {saving ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sucesso */}
      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Informações atualizadas</AlertDialogTitle>
            <AlertDialogDescription>
              Suas informações pessoais foram salvas com sucesso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessOpen(false)}>
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alterações não salvas */}
      <AlertDialog open={blocker.status === "blocked"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              há alterações não salvas, você gostaria de sair mesmo assim?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se sair agora, as alterações feitas nesta tela serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => blocker.proceed?.()}>
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

export { labels };
