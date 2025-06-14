import {
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import {
  createNewProfile,
  lookUpUserProfile,
  getUserSession,
} from "../../supabase_queries/auth.js";
import { getExtracts } from "../../supabase_queries/feed";
import {
  getAllDueSubscriptions,
  getExtractByTextIdChapter,
  createInstalment,
  updateSubscription,
} from "../../supabase_queries/subscriptions";
import { ExtractType } from "../../types/types.js";
import Extract from "../../components/extract";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { useRef } from "react";

const adUnitId = TestIds.ADAPTIVE_BANNER;

function RightAction() {
  return <Reanimated.View style={{ width: 250 }} />;
}

export default function FeedScreen() {
  const bannerRef = useRef<BannerAd>(null);
  const router = useRouter();
  const [extracts, setExtracts] = useState([] as ExtractType[]);
  const [refreshing, setRefreshing] = useState(false);
  const [allExtractsDismissed, setAllExtractsDismissed] = useState(false);

  useForeground(() => {
    Platform.OS === "android" && bannerRef.current?.load();
  });

  useEffect(() => {
    const checkUserAuthenticated = async function () {
      const user = await getUserSession();

      if (!user) {
        router.push("/");
      } else if (user) {
        checkUserProfileStatus(user.id);
        await fetchExtracts();
        await processSubscriptions(user.id);
      }
    };
    checkUserAuthenticated();
  }, []);

  const checkUserProfileStatus = async function (userId: string) {
    const userProfile = await lookUpUserProfile(userId);
    if (!userProfile) {
      await createNewProfile(userId, new Date());
    }
  };

  const handleDismiss = (id: number) => {
    setExtracts((prev) => {
      if (extracts.length - 1 === 0) {
        console.log("All extracts dismissed");
        setAllExtractsDismissed(true);
      }
      return prev.filter((extract) => extract.id !== id);
    });
  };

  const processSubscriptions = async function (userId: string) {
    const subscriptions = await getAllDueSubscriptions(userId);
    if (subscriptions) {
      for (let i = 0; i < subscriptions.length; i++) {
        const extract = await getExtractByTextIdChapter(
          subscriptions[i].textid,
          subscriptions[i].chapter
        );

        const userProfile = await lookUpUserProfile(userId);
        let interval;
        if (userProfile.subscriptioninterval) {
          interval =
            new Date().getTime() + userProfile.subscriptioninterval * 86400000;
        } else {
          interval = new Date().getTime() + 7 * 86400000;
        }

        if (extract) {
          const updatedSubscription = await updateSubscription(
            subscriptions[i].id,
            subscriptions[i].chapter + 1,
            interval
          );

          if (updatedSubscription) {
            const newInstalment = await createInstalment(
              userId,
              extract.id,
              extract.chapter,
              extract.title,
              extract.author,
              updatedSubscription[i].id,
              updatedSubscription[i].subscribeart,
              updatedSubscription[i].due
            );

            if (newInstalment) {
              console.log("Instalment created successfully");
            }
          }
        }
      }
    } else {
      console.log("Subscriptions up to date");
    }
  };

  const fetchExtracts = async function () {
    setRefreshing(true);
    setAllExtractsDismissed(false);

    const shuffle = (array: ExtractType[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const extracts = await getExtracts();
    if (extracts) {
      const shuffledExtracts = shuffle(extracts);
      setExtracts(shuffledExtracts);
    } else {
      setExtracts([]);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.feedWrapper}
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchExtracts}
          tintColor="#F6F7EB"
        />
      }
    >
      {extracts && extracts.length > 0 ? (
        extracts.map((extract: ExtractType, index: number) => (
          <ReanimatedSwipeable
            key={extract.id}
            friction={2}
            containerStyle={styles.swipeable}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={RightAction}
            onSwipeableWillOpen={() => handleDismiss(extract.id)}
          >
            <Extract
              key={index}
              id={extract.id}
              textid={extract.textid}
              author={extract.author}
              title={extract.title}
              year={extract.year}
              chapter={extract.chapter}
              previewtext={extract.previewtext}
              fulltext={extract.fulltext}
              subscribeart={extract.subscribeart}
              portrait={extract.portrait}
              coverart={extract.coverart}
            />
          </ReanimatedSwipeable>
        ))
      ) : allExtractsDismissed ? (
        <TouchableOpacity style={styles.refresh} onPress={fetchExtracts}>
          <Ionicons name="arrow-down" size={36} color="#F6F7EB" />
          <Text style={styles.pulldown}>Pull to be served more extracts</Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="#393E41" />
      )}
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feedWrapper: {
    alignItems: "center",
    paddingVertical: 24,
  },
  container: {
    backgroundColor: "#393E41",
    flex: 1,
  },
  headerBar: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  primaryButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  rightAction: {
    backgroundColor: "#F6F7EB",
    fontFamily: "QuicksandReg",
    color: "#393E41",
    fontSize: 16,
    padding: 16,
    borderRadius: 50,
  },
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    width: "90%",
    minWidth: 250,
    maxWidth: 768,
  },
  refresh: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pulldown: {
    fontFamily: "QuicksandReg",
    fontSize: 18,
    color: "#F6F7EB",
  },
});
