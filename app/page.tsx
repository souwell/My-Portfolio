"use client";

import Game from "@/app/components/Game";
import Contact from "@/app/components/sections/Contact";
import Header from "@/app/components/sections/Header";
import Profile from "@/app/components/sections/Profile";
import Projects from "@/app/components/sections/Projects";
import StarSeparator from "@/app/components/StarSeparator";
import useGame from "@/app/utils/useGame";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import NavigationButton from "@/app/components/NavigationButton";
import React from "react";

export default function Home() {
  return (
    <>
      <Header />
      <Game />

      <main className="pt-10 md:pt-20">
        <h2 className="md:hidden text-3xl text-center mb-5 font-light italic">
          Meu portfólio
        </h2>
        <Profile />
        <StarSeparator id="projects" />
        <Projects />
        <StarSeparator id="contact" />
        <Contact />
      </main>

      <NavigationButton />
    </>
  );
}
