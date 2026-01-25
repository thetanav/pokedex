import { useState } from "react";
import {
  FlatList,
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonNames } from "../../hooks/usePokemon";

interface PokemonName {
  name: string;
  url: string;
}

export default function Search() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePokemonNames();
  const [searchQuery, setSearchQuery] = useState("");

  const allNames = data?.pages.flatMap(page => page.names) || [];
  const filteredNames = allNames.filter(name =>
    name.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Loading Pokemon names...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading Pokemon names</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: PokemonName }) => (
    <Link
      href={{ pathname: "/details", params: { name: item.name } }}
      asChild
    >
      <Pressable className="bg-white p-4 border-b border-gray-200">
        <Text className="text-lg font-bold capitalize">{item.name}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base outline-none"
            placeholder="Search Pokemon names..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredNames}
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
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              {searchQuery
                ? `No Pokemon found for "${searchQuery}"`
                : "Start typing to search Pokemon names"}
            </Text>
          </View>
        }
      />
    </View>
  );
}