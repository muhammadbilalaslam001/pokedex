import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../db';

export const pokemonRouter = router({
  getPokemonByName: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findUnique({
        where: { name: input },
        include: {
          types: true,
        },
      });

      if (!pokemon) {
        throw new Error(`Pokemon with name ${input} not found`);
      }

      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.name),
        sprite: pokemon.sprite,
      };
    }),

  getPokemonByNames: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input }) => {
      const pokemons = await prisma.pokemon.findMany({
        where: {
          name: {
            in: input,
          },
        },
        include: {
          types: true,
        },
      });

      return pokemons.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.name),
        sprite: pokemon.sprite,
      }));
    }),

  getPokemonByType: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      if (!input) {
        const allPokemon = await prisma.pokemon.findMany({
          include: {
            types: true,
          },
        });

        return allPokemon.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((type) => type.name),
          sprite: pokemon.sprite,
        }));
      }

      const pokemonWithType = await prisma.type.findUnique({
        where: { name: input },
        include: {
          pokemons: {
            include: {
              types: true,
            },
          },
        },
      });

      if (!pokemonWithType) {
        return [];
      }

      return pokemonWithType.pokemons.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.name),
        sprite: pokemon.sprite,
      }));
    }),

  getAllTypes: publicProcedure.query(async () => {
    const types = await prisma.type.findMany();
    return types.map(type => type.name);
  }),
}); 