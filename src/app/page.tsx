'use client';

import { Navigation } from '@/components/Navigation';
import { SinglePokemonForm } from '@/components/SinglePokemonForm';
import { ThemeInfo } from '@/components/ThemeInfo';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
  useEffect(() => {
    const homeToastKey = 'hasShownHomeToast';
    const hasShownToast = sessionStorage.getItem(homeToastKey);
    
    if (!hasShownToast) {
      const toastId = setTimeout(() => {
        toast.success('Welcome to Pokédex! Enter a Pokémon name to get started.');
        sessionStorage.setItem(homeToastKey, 'true');
      }, 1000);
      
      return () => clearTimeout(toastId);
    }
  }, []);
  
  return (
    <main>
      <Navigation />
      <SinglePokemonForm />
      <ThemeInfo />
    </main>
  );
}
