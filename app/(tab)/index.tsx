import { Link } from "expo-router";
import { FlatList, View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { usePokemonList } from "../../hooks/usePokemon";

export default function Index() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePokemonList();

  const pokes = data?.pages.flatMap(page => page.pokemons) || [];

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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Loading Pokemons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading Pokemons</Text>
      </View>
    );
  }

  const renderItem = ({ item: p }: { item: any }) => (
    <Link
      key={p.name}
      href={{ pathname: "/details", params: { name: p.name } }}
      asChild
    >
      <Pressable
        className="rounded-3xl p-3 flex-col items-center justify-center shadow-sm mb-4"
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
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={pokes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" />
          </View>
        ) : null
      }
      contentContainerStyle={{ padding: 16 }}
    />
  );
}