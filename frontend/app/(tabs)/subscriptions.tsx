import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSubscriptions } from "@/context/SubscriptionContext";
import SubscriptionCard from "@/components/SubscriptionCard";

const SubscriptionsScreen = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter subscriptions based on search query
  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return subscriptions;

    return subscriptions.filter((sub) =>
      sub.name.toLowerCase().includes(query) ||
      sub.category?.toLowerCase().includes(query) ||
      sub.plan?.toLowerCase().includes(query)
    );
  }, [searchQuery, subscriptions]);

  const renderItem = ({ item }: { item: Subscription }) => (
    <View style={{ marginBottom: 16 }}>
      <SubscriptionCard
        {...item}
        expanded={expandedId === item.id}
        onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        {/* Header Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 30, fontFamily: "sans-extrabold", color: "#081126" }}>
            Subscriptions
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <View style={{ backgroundColor: "rgba(234, 122, 83, 0.1)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
              <Text style={{ color: "#ea7a53", fontSize: 14, fontFamily: "sans-bold" }}>
                {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'Active' : 'Active Subscriptions'}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar Container */}
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          backgroundColor: "#fff8e7", 
          borderWidth: 1, 
          borderColor: "rgba(0,0,0,0.08)", 
          borderRadius: 16, 
          paddingHorizontal: 16, 
          height: 60,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2
        }}>
          <Ionicons name="search" size={20} color="rgba(8, 17, 38, 0.4)" />
          <TextInput
            style={{ 
              flex: 1, 
              marginLeft: 12, 
              fontSize: 16, 
              fontFamily: "sans-medium", 
              color: "#081126",
              height: "100%"
            }}
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(8, 17, 38, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            selectionColor="#ea7a53"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="rgba(8, 17, 38, 0.4)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Subscriptions List */}
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }} 
          ListEmptyComponent={
            <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#fff8e7", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ionicons name="search-outline" size={40} color="rgba(8, 17, 38, 0.15)" />
              </View>
              <Text style={{ color: "#081126", fontFamily: "sans-bold", fontSize: 18 }}>
                No results found
              </Text>
              <Text style={{ color: "rgba(8, 17, 38, 0.5)", fontFamily: "sans-medium", marginTop: 4, textAlign: "center", paddingHorizontal: 40 }}>
                We couldn't find any subscriptions matching "{searchQuery}"
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;
