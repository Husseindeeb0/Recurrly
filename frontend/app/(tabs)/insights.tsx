import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from "@/context/SubscriptionContext";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";

const InsightsScreen = () => {
  const { subscriptions } = useSubscriptions();

  const stats = useMemo(() => {
    const monthlyTotal = subscriptions.reduce((acc, sub) => {
      const price = sub.price || 0;
      return acc + (sub.billing === "Yearly" ? price / 12 : price);
    }, 0);

    const categories = subscriptions.reduce((acc, sub) => {
      const cat = sub.category || "Other";
      acc[cat] = (acc[cat] || 0) + (sub.billing === "Yearly" ? sub.price / 12 : sub.price);
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    const mostExpensive = [...subscriptions].sort((a, b) => {
      const priceA = a.billing === "Yearly" ? a.price / 12 : a.price;
      const priceB = b.billing === "Yearly" ? b.price / 12 : b.price;
      return priceB - priceA;
    })[0];

    return {
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
      sortedCategories,
      mostExpensive,
      count: subscriptions.length,
    };
  }, [subscriptions]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 30, fontFamily: "sans-extrabold", color: "#081126" }}>
            Insights
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "sans-medium", color: "rgba(8, 17, 38, 0.5)", marginTop: 4 }}>
            Analyze your spending habits
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 32 }}>
          <View style={{ flex: 1, backgroundColor: "#ea7a53", padding: 20, borderRadius: 24 }}>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "sans-bold", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Monthly</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontFamily: "sans-extrabold" }}>
              {formatCurrency(stats.monthlyTotal)}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#081126", padding: 20, borderRadius: 24 }}>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "sans-bold", fontSize: 12, textTransform: "uppercase", marginBottom: 4 }}>Subscriptions</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontFamily: "sans-extrabold" }}>{stats.count}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontFamily: "sans-bold", color: "#081126", marginBottom: 16 }}>Category Breakdown</Text>
          <View style={{ backgroundColor: "#fff8e7", borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", borderRadius: 24, padding: 20 }}>
            {stats.sortedCategories.map(([cat, amount], index) => (
              <View key={cat} style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "between", 
                marginTop: index !== 0 ? 16 : 0,
                paddingTop: index !== 0 ? 16 : 0,
                borderTopWidth: index !== 0 ? 1 : 0,
                borderTopColor: "rgba(0,0,0,0.05)"
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#ea7a53", marginRight: 12 }} />
                  <Text style={{ fontFamily: "sans-semibold", color: "#081126", fontSize: 16 }}>{cat}</Text>
                </View>
                <Text style={{ fontFamily: "sans-bold", color: "#081126", fontSize: 16 }}>{formatCurrency(amount)}</Text>
              </View>
            ))}
            {stats.sortedCategories.length === 0 && (
              <Text style={{ color: "rgba(8, 17, 38, 0.5)", fontFamily: "sans-medium", textAlign: "center", paddingVertical: 16 }}>No data available</Text>
            )}
          </View>
        </View>

        {/* Spotlight */}
        {stats.mostExpensive && (
          <View style={{ marginBottom: 40 }}>
            <Text style={{ fontSize: 18, fontFamily: "sans-bold", color: "#081126", marginBottom: 16 }}>Highest Spend</Text>
            <View style={{ backgroundColor: "#8fd1bd", padding: 24, borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#081126", fontFamily: "sans-extrabold", fontSize: 20 }}>{stats.mostExpensive.name}</Text>
                <Text style={{ color: "rgba(8, 17, 38, 0.6)", fontFamily: "sans-medium", fontSize: 14 }}>{stats.mostExpensive.plan}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "#081126", fontFamily: "sans-bold", fontSize: 18 }}>
                  {formatCurrency(stats.mostExpensive.price)}
                </Text>
                <Text style={{ color: "rgba(8, 17, 38, 0.6)", fontFamily: "sans-medium", fontSize: 12, textTransform: "uppercase" }}>{stats.mostExpensive.billing}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Efficiency Tip */}
        <View style={{ backgroundColor: "#f6eecf", padding: 20, borderRadius: 20, flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 40, height: 40, backgroundColor: "rgba(234, 122, 83, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 16 }}>
            <Ionicons name="bulb" size={20} color="#ea7a53" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "sans-bold", color: "#081126", fontSize: 16 }}>Pro Tip</Text>
            <Text style={{ fontSize: 12, fontFamily: "sans-medium", color: "rgba(8, 17, 38, 0.6)", marginTop: 2 }}>
              Switching to annual billing on {stats.mostExpensive?.name || 'your apps'} could save you up to 20% yearly.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default InsightsScreen;
