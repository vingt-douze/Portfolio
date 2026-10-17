import { IconHistory } from "@tabler/icons-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Tag from "@/components/tag/Tag";
import type { ProjectIdType, ProjectType } from "../project";
import "./project.scss";
import { stackItem } from "@/components/stack/data";
import StackIcon from "@/components/stack/icon/StackIcon";
import type { StackType } from "@/components/stack/stack";
import Tooltip from "@/components/tooltip/Tooltip";
import { useI18nContext } from "@/i18n/i18n-react";
import { useSettingsStore } from "@/stores/settings.store";
import type { ActiveTheme } from "@/types/settings";
import Album from "../album/Album";
import ProjectStacks from "../stacks/ProjectStacks";

const IMG_MAX_WIDTH = 512;
const ICON_SIZE = 32;

export default function Project({
  project,
  id,
}: {
  project: ProjectType;
  id: ProjectIdType;
}) {
  const selectedStacks = [
    "swift",
    "nextJs",
    "typescript",
    "javascript",
    "prisma",
    "electron",
    "fastify",
  ];
  const { LL } = useI18nContext();
  const theme = useSettingsStore((state) => state.activeTheme);
  const date = project.endDate || project.startDate;

  return (
    <section className="project">
      <div>
        <header>
          <h4>
            {project.icon && (
              <Image src={project.icon} alt="" width={ICON_SIZE} height={ICON_SIZE} />
            )}
            {LL.projects[id].name()}
            <Tooltip
              label={LL.projects[id].name()}
              content={<ProjectStacks stacks={project.technologies.map((t) => stackItem[t])} />}
            >
              <span>
                {project.technologies
                  .filter((tech) => selectedStacks.includes(tech))
                  .map((tech) => (
                    <StackIcon key={tech} stack={stackItem[tech]} size={16} />
                  ))}
              </span>
            </Tooltip>
          </h4>
          <Album images={[...new Set([project.thumbnail, ...project.images])]} />
        </header>
        <div className="content">
          <div className="tags">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <p>{LL.projects[id].description()}</p>

          <div className="actions">
            {project.url && <Button text={LL.section.projects.visitButton()} url={project.url} />}
            {project.repo && (
              <Button
                text={LL.section.projects.repositoryButton()}
                url={project.repo}
                type="text"
              />
            )}
            <time dateTime={date}>
              <IconHistory size={18} strokeWidth={2.5} />
              {date.slice(0, 4)}
            </time>
          </div>
        </div>
      </div>
    </section>
  );
}

function getImageUrl(theme: ActiveTheme, stack: StackType) {
  return theme === "light" ? stack.styles.iconLight || stack.styles.icon : stack.styles.icon;
}

function getFilter(theme: ActiveTheme, stack: StackType) {
  let filter = undefined;
  if (
    (theme === "dark" && stack.styles.invert === "black") ||
    (theme === "light" && stack.styles.invert === "white")
  ) {
    filter = "invert(1)";
  }
  return {
    filter,
  };
}
