import { MentoriasBreadcrumb } from "@/modules/mentorias/components/MentoriasBreadcrumb";
import { useInstitutionSettings } from "@/shared/lib/institution-settings";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarOpen } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export function ContatosLocalizacaoPage() {
  const [sidebarOpen, toggleSidebar] = useSidebarOpen();
  const { contacts: info } = useInstitutionSettings();
  const contacts = [
    {
      title: "WhatsApp",
      value: info.whatsapp,
      description: "Converse com nossa equipe.",
      action: "Iniciar conversa",
      href: `https://wa.me/${info.whatsapp.replace(/\D/g, "")}`,
      icon: MessageCircle,
    },
    {
      title: "Telefone",
      value: info.phone,
      description: "Entre em contato por ligação.",
      action: "Ligar agora",
      href: `tel:+${info.phone.replace(/\D/g, "")}`,
      icon: Phone,
    },
    {
      title: "E-mail",
      value: info.email,
      description: "Envie sua dúvida por e-mail.",
      action: "Enviar e-mail",
      href: `mailto:${info.email}`,
      icon: Mail,
    },
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <AppSidebar open={sidebarOpen} />
      <main
        className={cn(
          "h-full overflow-y-auto pt-16 transition-[padding-left] duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-0",
        )}
      >
        <MentoriasBreadcrumb />
        <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6">
          <PageHeader
            section="Ajuda"
            title="Contatos e Localização"
            description="Fale com a equipe da A3 ou encontre nossa unidade."
          />
          <section aria-labelledby="contatos-heading" className="space-y-4">
            <h2 id="contatos-heading" className="text-xl text-foreground">
              Fale com a A3
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {contacts.map((contact) => {
                const Icon = contact.icon;
                return (
                  <article
                    key={contact.title}
                    className="flex min-h-52 flex-col rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft/50 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <h3 className="text-lg text-foreground">
                        {contact.title}
                      </h3>
                    </div>
                    <p className="mt-4 break-words text-sm font-semibold text-foreground">
                      {contact.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {contact.description}
                    </p>
                    <a
                      href={contact.href}
                      className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {contact.action}
                    </a>
                  </article>
                );
              })}

              <article className="flex min-h-52 flex-col rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:col-span-2 xl:col-span-1">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft/50 text-primary">
                    <Clock3 aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="text-lg text-foreground">
                    Horário de atendimento
                  </h3>
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {info.days}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {info.hours}
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="localizacao-heading" className="space-y-4">
            <h2 id="localizacao-heading" className="text-xl text-foreground">
              Nossa localização
            </h2>
            <div className="grid gap-4 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.6fr)]">
              <article className="flex flex-col rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft/50 text-primary">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg text-foreground">{info.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {info.building}
                    </p>
                  </div>
                </div>
                <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
                  <p>{info.street}</p>
                  <p>{info.city}</p>
                  <p>{info.postal}</p>
                </address>
                <a
                  href={info.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Navigation
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />
                  Abrir no Google Maps
                </a>
              </article>

              <div className="min-h-72 overflow-hidden rounded-md border border-border bg-muted shadow-[var(--shadow-card)] sm:min-h-96">
                <iframe
                  title={`Mapa de ${info.name}`}
                  src={info.embed}
                  className="h-full min-h-72 w-full sm:min-h-96"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
