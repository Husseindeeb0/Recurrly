import "../../global.css";
import { Text, View, Image, Pressable, FlatList } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useState } from "react";

const SafeAreaView = styled(RNSafeAreaView); //  To enable the use of native wind styling on SAV
export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={require("../../assets/images/avatar.png")}
                  className="home-avatar"
                />
                <Text className="home-user-name"></Text>
              </View>

              {/* <Pressable onPress={() => setIsModalVisible(true)}>
          <Image source={icons.add} className="home-add-icon" />
        </Pressable> */}
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-info">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MMM DD, YYYY")}
                </Text>
              </View>
            </View>
            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
