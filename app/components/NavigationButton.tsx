"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";

export default function NavigationButton() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const atTop = scrollPosition < 100; // Consider "at top" if within 100px from top

      setIsAtTop(atTop);
      setIsVisible(true);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollDown = () => {
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* "Scroll to see more" button - shown at top */}
      {isAtTop && (
        <button
          onClick={scrollDown}
          className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 
                     flex items-center gap-2 
                     py-2 px-4
                     bg-background/60 backdrop-blur-sm
                     border border-border
                     rounded-full
                     text-foreground text-sm font-medium"
          aria-label="Scroll down to see more"
        >
          <span className="text-nowrap mb-0.5">Arraste para ver mais</span>
          <ChevronDown />
        </button>
      )}

      {/* Scroll to top button - shown when scrolled */}
      {!isAtTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 
                     w-10 h-10 
                     border border-border
                     bg-background/60 backdrop-blur-sm
                     rounded-lg
                     shadow-lg
                     transition-all duration-300
                     hover:scale-110 hover:shadow-xl
                     flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
