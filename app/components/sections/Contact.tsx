import { SiInstagram, SiLinkedin, SiGithub, SiGmail } from "react-icons/si";

const contactLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/souwell.com_",
    icon: SiInstagram,
    color: "hover:text-pink-500",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/souwell",
    icon: SiLinkedin,
    color: "hover:text-blue-600",
  },
  {
    name: "GitHub",
    url: "https://github.com/souwell",
    icon: SiGithub,
    color: "hover:text-gray-800 dark:hover:text-white",
  },
  {
    name: "Gmail",
    url: "mailto:contato@souwell.com",
    icon: SiGmail,
    color: "hover:text-red-500",
  },
];

export default function Contact() {
  return (
    <section className="mt-20 pb-20">
      <h2 className="text-center text-2xl mb-4">
        Podemos conversar?
      </h2>
      <p className="text-center mb-10 max-w-md mx-auto">
        Estou sempre aberto a novas oportunidades e conexões. <br /> Sinta-se à vontade para me contatar!
      </p>
      <div className="flex justify-center gap-6 md:gap-10">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-2 transition-colors ${link.color}`}
            aria-label={link.name}
          >
            <link.icon className="w-8 h-8" />
            {/* <span className="text-xs md:text-sm">{link.name}</span> */}
          </a>
        ))}
      </div>
    </section>
  );
}