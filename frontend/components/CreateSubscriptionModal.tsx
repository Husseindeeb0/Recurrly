import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import clsx from "clsx";
import { icons } from "@/constants/icons";
import { posthog } from "@/src/config/posthog";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (subscription: Subscription) => void;
}

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ff8c00",
  "AI Tools": "#8fd1bd",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8d4e3",
  Cloud: "#b8e8d0",
  Music: "#ffb6c1",
  Other: "#f6eecf",
};

const CreateSubscriptionModal = ({ isVisible, onClose, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newSubscription: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: priceNum,
      frequency,
      category,
      status: "active",
      startDate: dayjs().toISOString(),
      renewalDate: dayjs()
        .add(1, frequency === "Monthly" ? "month" : "year")
        .toISOString(),
      icon: icons.wallet,
      billing: frequency,
      currency: "USD",
      color: CATEGORY_COLORS[category] || "#f6eecf",
    };

    onAdd(newSubscription);

    posthog.capture("subscription_created", {
      subscription_name: name.trim(),
      subscription_price: priceNum,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const isFormValid = name.trim() && !isNaN(parseFloat(price)) && parseFloat(price) > 0;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <TouchableOpacity onPress={onClose} className="modal-close">
                <Ionicons name="close" size={24} color="#081126" />
              </TouchableOpacity>
            </View>

            <ScrollView className="modal-body">
              <View className="auth-field">
                <Text className="auth-label">Subscription Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Netflix, Spotify, etc."
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="rgba(8, 17, 38, 0.4)"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                  placeholderTextColor="rgba(8, 17, 38, 0.4)"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Billing Frequency</Text>
                <View className="picker-row">
                  <TouchableOpacity
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Monthly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active"
                      )}
                    >
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Yearly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active"
                      )}
                    >
                      Yearly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active"
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className={clsx(
                  "auth-button mb-10",
                  !isFormValid && "auth-button-disabled"
                )}
                onPress={handleSubmit}
                disabled={!isFormValid}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
