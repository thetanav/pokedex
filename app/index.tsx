import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, Pressable } from "react-native";

export default function Index() {
  const [pokes, setPokes] = useState<
    {
      name: string;
      fimage: string;
      bimage: string;
      fshiny: string;
      bshiny: string;
      types: string;
      weight: string;
      shiny: boolean;
    }[]
  >([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
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

      setPokes(detailedPokemons);
    } catch (e) {
      console.log(e);
    }
  }

  const color = (i: any) => {
    const colors: Record<string, string> = {
      normal: "#E4E4E7",
      fire: "#FFD6C9",
      water: "#CFE5FF",
      electric: "#FFE08A",
      grass: "#CDECCD",
      ice: "#CDEFF6",
      fighting: "#F4B8B8",
      poison: "#D9C2F0",
      ground: "#E6D3A3",
      flying: "#D6DCFF",
      psychic: "#FFC1D9",
      bug: "#DDE8B5",
      rock: "#D6CCB5",
      ghost: "#C9C3E6",
      dragon: "#C4B8FF",
      dark: "#C6C6C6",
      steel: "#D1D9E6",
      fairy: "#FFD1E6",
    };

    return colors[i];
  };

  return (
    <ScrollView className="p-4" contentContainerStyle={{ gap: 8 }}>
      {pokes &&
        pokes.map((p, index) => (
          <Link
            key={p.name}
            href={{ pathname: "/details", params: { name: p.name } }}
            asChild
          >
            <Pressable
              className="rounded-3xl p-3 flex-col items-center justify-center"
              style={{ backgroundColor: color(p.types) }}
            >
              <View className="flex-row gap-2">
                <Image
                  source={{ uri: p.shiny ? p.fshiny : p.fimage }}
                  style={{ width: 130, height: 130 }}
                />
                <Image
                  source={{ uri: p.shiny ? p.bshiny : p.bimage }}
                  style={{ width: 120, height: 120 }}
                />
              </View>
              <Text className="text-2xl opacity-80 font-bold">{p.name}</Text>
              <Text className="text-lg opacity-50 font-bold">{p.types}</Text>
            </Pressable>
          </Link>
        ))}
    </ScrollView>
  );
}
