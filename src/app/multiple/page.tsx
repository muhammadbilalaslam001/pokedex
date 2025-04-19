"use client";

import { Navigation } from "@/components/Navigation";
import { MultiplePokemonForm } from "@/components/MultiplePokemonForm";
import { ThemeInfo } from "@/components/ThemeInfo";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function MultiplePage() {
  useEffect(() => {
    const multipleToastKey = "hasShownMultipleToast";
    const hasShownToast = sessionStorage.getItem(multipleToastKey);

    if (!hasShownToast) {
      const toastId = setTimeout(() => {
        toast.success(
          "Search for multiple Pokémon by entering comma-separated names!"
        );
        sessionStorage.setItem(multipleToastKey, "true");
      }, 1000);

      return () => clearTimeout(toastId);
    }
  }, []);

  return (
    <main>
      <Navigation />
      <MultiplePokemonForm />
      <ThemeInfo />
    </main>
  );
}
