import "./card.scss";
import Button from "@/components/button/Button";
import type { TablerIcon } from "@tabler/icons-react";
import ProsAndCons from "../pros-and-cons/ProsAndCons";

export default function ContactCard({
  title,
  description,
  Icon,
  isBest,
  actionTitle,
  actionType,
  actionUrl,
  action,
  pros,
  cons,
}: {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Icon?: TablerIcon;
  isBest?: boolean;
  actionTitle: string;
  actionType: "primary" | "secondary";
  actionUrl?: string;
  action?: () => void;
  pros: string[];
  cons: string[];
}) {
  return (
    <section className="contact-card">
      <div>
        <header>
          <div>
            {Icon && <Icon size={32} strokeWidth={2} />}
            <h3>{title}</h3>
          </div>
          <p>{description}</p>
          <hr />
        </header>
        <div className="content">
          <ProsAndCons pros={pros} cons={cons} />
        </div>
        <hr />
        <Button
          type={actionType}
          text={actionTitle}
          url={actionUrl ? actionUrl : undefined}
          onClick={action ? action : undefined}
        />
      </div>
    </section>
  );
}
