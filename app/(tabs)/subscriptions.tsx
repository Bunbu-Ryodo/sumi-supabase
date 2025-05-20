import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Instalment from "../../components/instalment";

import { useEffect, useState } from "react";
import { getUserSession } from "../../supabase_queries/auth.js";
import {
  getAllInstalments,
  getAllUpcomingSubscriptions,
} from "../../supabase_queries/subscriptions";
import { InstalmentType, SubscriptionType } from "../../types/types";
import PendingInstalment from "../../components/pendingInstalment";

export default function Subscriptions() {
  useEffect(() => {
    const fetchInstalments = async () => {
      const user = await getUserSession();

      if (user) {
        const instalments = await getAllInstalments(user.id);

        if (instalments && instalments.length > 0) {
          populateInstalments(instalments);
        } else {
          setLoading(false);
        }
      }
    };

    const fetchSubscriptions = async () => {
      const user = await getUserSession();

      if (user) {
        const upcomingSubscriptions = await getAllUpcomingSubscriptions(
          user.id
        );

        console.log("upcomingSubscriptions", upcomingSubscriptions);

        if (upcomingSubscriptions && upcomingSubscriptions.length > 0) {
          console.log("upcomingSubscriptions", upcomingSubscriptions);
          populateSubscriptions(upcomingSubscriptions);
        } else {
          setLoading(false);
        }
      }
    };
    fetchInstalments();
    fetchSubscriptions();
  }, []);

  async function populateInstalments(instalments: InstalmentType[]) {
    setInstalments(() => {
      setLoading(false);
      return instalments || [];
    });
  }

  async function populateSubscriptions(subscriptions: SubscriptionType[]) {
    setActiveSubscriptions(() => {
      setLoading(false);
      console.log(subscriptions, "Subscriptions");
      return subscriptions || [];
    });
  }

  const [instalments, setInstalments] = useState<InstalmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    SubscriptionType[]
  >([]);
  return (
    <ScrollView
      contentContainerStyle={styles.subscriptionWrapper}
      style={styles.container}
    >
      <View style={styles.extractWrapper}>
        <View style={styles.subscriptionsHeader}>
          <Text style={styles.newInstallmentsHeader}>Your Instalments</Text>
          <View style={styles.headerIconContainer}>
            <Ionicons name="mail-unread" size={24} color={"#393E41"}></Ionicons>
          </View>
        </View>
        <View style={styles.subscriptionSection}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ActivityIndicator size="large" color="#393E41" />
            </View>
          ) : instalments.length > 0 ? (
            instalments.map((instalment, index) => (
              <Instalment
                key={index}
                id={instalment.id}
                extractid={instalment.extractid}
                title={instalment.title}
                author={instalment.author}
                chapter={instalment.chapter}
                subscribeart={instalment.subscribeart}
                sequeldue={instalment.sequeldue}
              />
            ))
          ) : activeSubscriptions.length > 0 ? (
            activeSubscriptions.map((subscription, index) => (
              <PendingInstalment
                key={index}
                id={subscription.id}
                title={subscription.title}
                author={subscription.author}
                chapter={subscription.chapter}
                subscribeart={subscription.subscribeart}
                due={subscription.due}
              />
            ))
          ) : (
            <Text style={styles.noInstalmentsText}>Subscribe to a series!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subscriptionWrapper: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F6F7EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F7EB",
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
  extractWrapper: {
    padding: 16,
    marginTop: 24,
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  subscriptionSection: {
    marginTop: 12,
    padding: 8,
    width: "100%",
    alignItems: "center",
  },
  noInstalmentsText: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
