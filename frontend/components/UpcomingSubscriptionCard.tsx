import { View, Image, Text } from "react-native";
import React from "react";
import { formatCurrency } from "@/lib/utils";

const UpcomingSubscriptionCard = ({
  icon,
  name,
  price,
  currency,
  daysLeft,
}: UpcomingSubscriptionCardProps) => {
  return (
    <View className="upcoming-card">
      <View>
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : `Last day`}
          </Text>
        </View>
        <Text className="upcoming-name" numberOfLines={1}>
          {name}
        </Text>
      </View>
    </View>
  );
};

export default UpcomingSubscriptionCard;
