import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
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
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { useRef } from "react";

let adUnitId = "";

if (__DEV__) {
  adUnitId = TestIds.ADAPTIVE_BANNER;
} else if (!__DEV__ && Platform.OS === "android") {
  adUnitId = "ca-app-pub-5850018728161057/6524403480";
} else if (!__DEV__ && Platform.OS === "ios") {
  adUnitId = "ca-app-pub-5850018728161057/3269917700";
}

export default function Subscriptions() {
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      bannerRef.current?.load();
    }
  });
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
      const upcomingSubscriptions = await getAllUpcomingSubscriptions(user.id);

      if (upcomingSubscriptions && upcomingSubscriptions.length > 0) {
        populateSubscriptions(upcomingSubscriptions);
      } else {
        setLoading(false);
      }
    }
  };
  const fetchSubscriptionData = async () => {
    setLoading(true);
    await fetchInstalments();
    await fetchSubscriptions();
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptionData();
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
      return subscriptions || [];
    });
  }

  const [instalments, setInstalments] = useState<InstalmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    SubscriptionType[]
  >([]);
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.subscriptionWrapper}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchSubscriptionData}
            tintColor="#F6F7EB"
          />
        }
      >
        {!loading && (
          <View style={styles.extractWrapper}>
            <View style={styles.subscriptionsHeader}>
              <Text style={styles.newInstallmentsHeader}>Your Instalments</Text>
              <View style={styles.headerIconContainer}>
                <Ionicons name="mail-unread" size={24} color={"#393E41"} />
              </View>
            </View>
            <View style={styles.subscriptionSection}>
              {instalments.length > 0
                ? instalments.map((instalment, index) => (
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
                : activeSubscriptions.length > 0
                ? activeSubscriptions.map((subscription, index) => (
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
                : null}
            </View>
          </View>
        )}
      </ScrollView>
      <BannerAd
        key={`ad-achievements`}
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </>
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
    fontSize: 20,
    color: "#393E41",
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
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  noInstalmentsText: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    color: "#393E41",
  },
});
