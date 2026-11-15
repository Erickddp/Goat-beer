import { site, type SocialLink } from "@/content/site";
import { FacebookIcon, InstagramIcon } from "@/components/ui/Icons";
import t from "@/content/i18n/es";

const ICON: Record<SocialLink["network"], typeof InstagramIcon> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: InstagramIcon,
};

/** Redes desde content/site.ts. Sin URL → se muestran atenuadas con aviso "por confirmar". */
export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {site.social.map((s) => {
        const Icon = ICON[s.network];
        const cls =
          "grid size-11 place-items-center rounded-full border transition-colors duration-200";
        return (
          <li key={s.network}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`${cls} border-gold/30 text-foam hover:border-gold hover:text-gold-soft`}
              >
                <Icon className="size-5" />
              </a>
            ) : (
              <span
                title={`${s.label}: ${t.order.socialPending}`}
                aria-label={`${s.label}: ${t.order.socialPending}`}
                role="img"
                className={`${cls} border-dashed border-foam/20 text-foam-faint`}
              >
                <Icon className="size-5" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
