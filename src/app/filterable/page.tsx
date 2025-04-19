'use client';

import { Navigation } from '@/components/Navigation';
import { FilterablePokedexTable } from '@/components/FilterablePokedexTable';
import { ThemeInfo } from '@/components/ThemeInfo';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function FilterablePage() {
  useEffect(() => {
    const filterableToastKey = 'hasShownFilterableToast';
    const hasShownToast = sessionStorage.getItem(filterableToastKey);
    
    if (!hasShownToast) {
      const toastId = setTimeout(() => {
        toast.success('Filter Pokémon by type using the dropdown menu!');
        sessionStorage.setItem(filterableToastKey, 'true');
      }, 1000);
      
      return () => clearTimeout(toastId);
    }
  }, []);
  
  return (
    <main>
      <Navigation />
      <FilterablePokedexTable />
      <ThemeInfo />
    </main>
  );
} 