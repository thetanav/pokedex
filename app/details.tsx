import { View, Text, ScrollView, Image, Switch, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";

interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  base_experience: number;
  species: {
    name: string;
    url: string;
  };
  types: { type: { name: string } }[];
  weight: number;
  height: number;
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

const Details = () => {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [male, setMale] = useState(true);
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    if (name) {
      fetchPokemonDetails(name as string);
    }
  }, [name]);

  async function fetchPokemonDetails(pokemonName: string) {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      );
      const data = await res.json();
      setPokemon(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  const getTypeColor = (type: string) => {
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
    return colors[type] || "#E4E4E7";
  };

  const getCurrentSprites = () => {
    if (!pokemon)
      return {
        front: null,
        back: null,
      };
    if (male || !pokemon.sprites.front_female) {
      if (shiny) {
        return {
          front: pokemon.sprites.front_shiny,
          back: pokemon.sprites.back_shiny,
        };
      }
      return {
        front: pokemon.sprites.front_default,
        back: pokemon.sprites.back_default,
      };
    } else {
      if (shiny) {
        return {
          front: pokemon.sprites.front_shiny_female,
          back: pokemon.sprites.back_shiny_female,
        };
      }
      return {
        front: pokemon.sprites.front_female,
        back: pokemon.sprites.back_female,
      };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Pokemon not found</Text>
      </View>
    );
  }

  const sprites = getCurrentSprites();

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon.name.toLocaleUpperCase(),
          headerRight: () => (
            <View className="flex-row items-center mr-4">
              <Text className="mr-2">F/M</Text>
              <Switch value={male} onValueChange={setMale} />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="p-4 gap-4">
        <Pressable
          onPressIn={() => setShiny(true)}
          onPressOut={() => setShiny(false)}
          className="realative items-center py-10"
          android_ripple={{ color: "rgba(0,0,0,0.15)" }}
        >
          {shiny && (
            <Text className="absolute top-4 right-4 bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-md">
              SHINY
            </Text>
          )}
          <View className="flex-row gap-4">
            {sprites.front && (
              <Image
                key={sprites.front}
                source={{ uri: sprites.front }}
                style={{ width: 150, height: 150 }}
              />
            )}
            {sprites.back && (
              <Image
                key={sprites.back}
                source={{ uri: sprites.back }}
                style={{ width: 150, height: 150 }}
              />
            )}
          </View>
        </Pressable>

        <View className="gap-2">
          <Text className="text-xl font-bold">Types</Text>
          <View className="flex-row gap-2">
            {pokemon.types.map((type, index) => (
              <View
                key={index}
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
              >
                <Text className="capitalize font-medium">{type.type.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-xl font-bold">Physical Stats</Text>
          <View className="flex-row justify-between">
            <Text>Height: {pokemon.height / 10} m</Text>
            <Text>Weight: {pokemon.weight / 10} kg</Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-xl font-bold">Abilities</Text>
          <View className="flex-row flex-wrap gap-2">
            {pokemon.abilities.map((ability, index) => (
              <View key={index} className="bg-gray-200 px-3 py-1 rounded-full">
                <Text className="capitalize">
                  {ability.ability.name.replace("-", " ")}
                </Text>
              </View>
            ))}
            <View className="bg-gray-200 px-3 py-1 rounded-full">
              <Text className="capitalize">EXP: {pokemon.base_experience}</Text>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-xl font-bold">Base Stats</Text>
          {pokemon.stats.map((stat, index) => (
            <View key={index} className="flex-row justify-between items-center">
              <Text className="capitalize w-24">
                {stat.stat.name.replace("-", " ")}
              </Text>
              <View className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                <View
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                />
              </View>
              <Text className="w-8 text-right">{stat.base_stat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Details;
