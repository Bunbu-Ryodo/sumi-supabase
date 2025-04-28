import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Subscription from "../../components/subscription";

import { useEffect, useState } from "react";
import { getUserSession } from "../../supabase_queries/auth.js";
import { getAllInstalments } from "../../supabase_queries/subscriptions";
import { InstalmentType, SubscriptionType } from "../../types/types";

export default function Subscriptions() {
  useEffect(() => {
    const fetchInstalments = async () => {
      const user = await getUserSession();

      if (user) {
        const { data, error } = await getAllInstalments(user.id);

        if (error) {
          console.error("Error fetching instalments:", error);
        }
        if (data && data.length > 0) {
          populateInstalments(data);
        }
      }
    };
    fetchInstalments();
  }, []);

  async function populateInstalments(instalments: InstalmentType[]) {
    setInstalments(() => {
      setLoading(false);
      return instalments || [];
    });
  }

  const [instalments, setInstalments] = useState<InstalmentType[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.extractContainer}>
        <View style={styles.subscriptionsHeader}>
          <Text style={styles.newInstallmentsHeader}>Your Instalments</Text>
          <View style={styles.headerIconContainer}>
            <Ionicons name="mail-unread" size={24} color={"#393E41"}></Ionicons>
          </View>
        </View>
        <View style={styles.subscriptionSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#393E41" />
          ) : instalments.length > 0 ? (
            instalments.map((instalment, index) => (
              <Subscription
                key={index}
                id={instalment.id}
                extractId={instalment.extractid}
                title={instalment.title}
                author={instalment.author}
                chapter={instalment.chapter}
                subscribeArt={instalment.subscribeart}
              />
            ))
          ) : (
            <Text style={styles.noInstalmentsText}>
              No instalments available
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#F6F7EB",
    alignItems: "center",
  },
  subscriptionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  newInstallmentsHeader: {
    fontFamily: "QuicksandReg",
    fontSize: 24,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  extractContainer: {
    padding: 16,
    marginTop: 24,
    width: "90%",
  },
  subscriptionSection: {
    marginTop: 12,
    flexDirection: "row",
    padding: 8,
    width: "100%",
    flexWrap: "wrap",
  },
  noInstalmentsText: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
