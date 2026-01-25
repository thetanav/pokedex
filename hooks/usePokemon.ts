import { useInfiniteQuery } from "@tanstack/react-query";

interface Pokemon {
  name: string;
  fimage: string;
  bimage: string;
  fshiny: string;
  bshiny: string;
  types: string;
  weight: string;
  shiny: boolean;
}

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ["pokemons", "list"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=10`);
      const data = await res.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (p: any) => {
          const res = await fetch(p.url);
          const details = await res.json();
          return {
            name: p.name,
            fimage: details.sprites.front_default,
            bimage: details.sprites.back_default,
            fshiny: details.sprites.front_shiny,
            bshiny: details.sprites.back_shiny,
            types: details.types[0].type.name,
            weight: details.weight,
            shiny: false,
          };
        }),
      );

      return {
        pokemons: detailedPokemons,
        nextOffset: data.next ? pageParam + 10 : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}

interface PokemonName {
  name: string;
  url: string;
}

export function usePokemonNames() {
  return useInfiniteQuery({
    queryKey: ["pokemons", "names"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=100`);
      const data = await res.json();

      return {
        names: data.results as PokemonName[],
        nextOffset: data.next ? pageParam + 100 : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}