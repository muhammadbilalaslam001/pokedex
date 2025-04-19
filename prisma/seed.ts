import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pokemonData = [
  {
    id: 1,
    name: 'Bulbasaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    types: ['grass', 'poison'],
  },
  {
    id: 4,
    name: 'Charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    types: ['fire'],
  },
  {
    id: 7,
    name: 'Squirtle',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    types: ['water'],
  },
  {
    id: 25,
    name: 'Pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    types: ['electric'],
  },
  {
    id: 94,
    name: 'Gengar',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    types: ['ghost', 'poison'],
  },
  {
    id: 143,
    name: 'Snorlax',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
    types: ['normal'],
  },
  {
    id: 150,
    name: 'Mewtwo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    types: ['psychic'],
  },
  {
    id: 151,
    name: 'Mew',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    types: ['psychic'],
  },
];

async function main() {
  console.log(`Start seeding...`);
  
  // Create types first
  const uniqueTypes = [...new Set(pokemonData.flatMap(pokemon => pokemon.types))];
  
  for (const typeName of uniqueTypes) {
    await prisma.type.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });
  }
  
  // Create Pokemon with their types
  for (const pokemon of pokemonData) {
    const createdPokemon = await prisma.pokemon.upsert({
      where: { name: pokemon.name },
      update: {
        sprite: pokemon.sprite,
      },
      create: {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprite,
      },
    });
    
    // Connect Pokemon to its types
    for (const typeName of pokemon.types) {
      const type = await prisma.type.findUnique({
        where: { name: typeName },
      });
      
      if (type) {
        await prisma.pokemon.update({
          where: { id: createdPokemon.id },
          data: {
            types: {
              connect: {
                id: type.id,
              },
            },
          },
        });
      }
    }
  }
  
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 