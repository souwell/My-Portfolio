import LogoLoopOriginal from "@/components/LogoLoop";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiPrisma, SiGit, SiGithub, SiDocker, SiVite, SiRedux, SiGraphql, SiFigma, SiHtml5, SiCss3, SiStorybook, SiSass, SiFramer, SiPhp, SiLaravel, SiMysql, SiFirebase, SiSupabase, SiFastify } from 'react-icons/si';

const LogoLoop = LogoLoopOriginal as any;

const techLogos = [
  { node: <SiJavascript color="#F7DF1E" />, title: "JavaScript" },
  { node: <SiTypescript color="#3178C6" />, title: "TypeScript" },
  { node: <SiReact color="#61DAFB" />, title: "React" },
  { node: <SiNextdotjs color="#2D3748" />, title: "Next.js" },
  { node: <SiTailwindcss color="#06B6D4" />, title: "Tailwind CSS" },
  { node: <SiNodedotjs color="#5FA04E" />, title: "Node.js" },
  { node: <SiExpress color="#2D3748" />, title: "Express" },
  { node: <SiMongodb color="#47A248" />, title: "MongoDB" },
  { node: <SiPostgresql color="#336791" />, title: "PostgreSQL" },
  { node: <SiFastify color="#336791" />, title: "Fastify" },
  { node: <SiPrisma color="#2D3748" />, title: "Prisma ORM" },
  { node: <SiGit color="#F05032" />, title: "Git" },
  { node: <SiGithub color="#2D3748" />, title: "GitHub" },
  { node: <SiDocker color="#2496ED" />, title: "Docker" },
  { node: <SiVite color="#646CFF" />, title: "Vite" },
  { node: <SiRedux color="#764ABC" />, title: "Redux" },
  { node: <SiGraphql color="#E10098" />, title: "GraphQL" },
  { node: <SiFigma color="#F24E1E" />, title: "Figma" },
  { node: <SiHtml5 color="#E34F26" />, title: "HTML5" },
  { node: <SiCss3 color="#1572B6" />, title: "CSS3" },
  { node: <SiStorybook color="#FF4785" />, title: "Storybook" },
  { node: <SiFramer color="#0055FF" />, title: "Framer Motion" },
  { node: <SiSass color="#CC6699" />, title: "Sass" },
  { node: <SiPhp color="#777BB4" />, title: "PHP" },
  { node: <SiLaravel color="#FF2D20" />, title: "Laravel" },
  { node: <SiMysql color="#4479A1" />, title: "MySQL" },
  { node: <SiFirebase color="#FFCA28" />, title: "Firebase" },
  { node: <SiSupabase color="#3ECF8E" />, title: "Supabase" },
];

export default function CodeIcons() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
        renderItem={(logo) => (
          <Tooltip>
            <TooltipTrigger className="cursor-crosshair hover:scale-125 transition-all">
              {logo.node}
            </TooltipTrigger>
            <TooltipContent>
              {logo.title}
            </TooltipContent>
          </Tooltip>
        )}
      />
    </div>
  );
}