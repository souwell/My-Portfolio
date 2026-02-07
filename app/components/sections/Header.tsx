import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Header() {
  return (
    <header className="header fixed w-full z-50 flex justify-end">
      <h2 className="hidden md:block">
        &#9733; Meu Portfólio
      </h2>
      <AnimatedThemeToggler />
    </header>
  );
}
