import * as Clipboard from "expo-clipboard";
import { Platform } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import {} from "react";
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";
import { getExtract } from "../../supabase_queries/extracts";
import { ExtractType } from "../../types/types";
import {
  checkForSubscription,
  createSubscription,
  activateSubscription,
  deactivateSubscription,
} from "../../supabase_queries/subscriptions";
import { awardAchievement } from "../../supabase_queries/achievements";
import {
  markAsRead,
  markAsUnread,
  checkReadStatus,
} from "../../supabase_queries/profiles";
import { getUserSession } from "../../supabase_queries/auth.js";
import supabase from "../../lib/supabase.js";
import { lookUpUserProfile } from "../../supabase_queries/auth";
import * as Notifications from "expo-notifications";
import {
  Gesture,
  GestureDetector,
  Directions,
} from "react-native-gesture-handler";

import Toast from "react-native-toast-message";
import type { PropsWithChildren } from "react";
import { runOnJS } from "react-native-reanimated";

type BounceInProps = PropsWithChildren<{}>;

const BounceView = forwardRef<any, BounceInProps>((props, ref) => {
  const scale = useRef(new Animated.Value(1)).current;

  useImperativeHandle(ref, () => ({
    bounce: () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3333,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      {props.children}
    </Animated.View>
  );
});

export default function EReader() {
  let { id } = useLocalSearchParams();

  // if (Platform.OS === "android") {
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: false,
  //       shouldSetBadge: false,
  //     }),
  //   });
  // }

  const [extract, setExtract] = useState<ExtractType>({
    id: 0,
    title: "",
    author: "",
    chapter: 0,
    year: "",
    previewtext: "",
    fulltext: "",
    portrait: "",
    coverart: "",
    textid: 0,
    subscribeart: "",
  });

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subid, setSubid] = useState(0);
  const [read, setRead] = useState(false);
  const [userid, setUserid] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [warmth, setWarmth] = useState(0);

  const router = useRouter();

  const backToFeed = () => {
    router.push({
      pathname: "/feed",
    });
  };

  const fontUp = () => {
    setFontSize((prevFont) => {
      if (prevFont + 4 > 32) {
        return prevFont;
      }
      return prevFont + 4;
    });
  };

  const fontDown = () => {
    setFontSize((prevFont) => {
      if (prevFont - 4 < 18) {
        return prevFont;
      }
      return prevFont - 4;
    });
  };

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(fontUp)();
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(fontDown)();
    });

  const adjustBrightness = () => {
    setWarmth((prevWarmth) => {
      if (prevWarmth < 4) {
        return prevWarmth + 1;
      } else return 0;
    });
  };

  const brightnessHex = ["#F6F7EB", "#FEECD1", "#FEE4BD", "#FFDAA3", "#393E41"];

  const checkForActiveSubscription = async (
    userId: string,
    extract: ExtractType
  ) => {
    const existingSubscription = await checkForSubscription(
      userId,
      extract.textid
    );

    const profile = await lookUpUserProfile(userId);

    let interval = new Date().getTime() + 604800000;

    if (profile) {
      if (profile.subscriptioninterval) {
        interval =
          new Date().getTime() + profile.subscriptioninterval * 86400000;
      }
    }

    if (existingSubscription) {
      if (
        existingSubscription.active &&
        existingSubscription.textid === extract.textid
      ) {
        setSubscribed(true);
      }
      setSubid(existingSubscription.id);
    } else {
      const newSubscription = await createSubscription(
        userId,
        extract.textid,
        extract.chapter + 1,
        interval,
        extract.subscribeart,
        extract.title,
        extract.author
      );

      if (newSubscription) {
        console.log("Subscription created successfully:", newSubscription);
        setSubid(newSubscription.id);
      }
    }
  };

  const setInitialReadStatus = async (userId: string, extract: ExtractType) => {
    await checkForActiveSubscription(userId, extract);

    const readStatus = await checkReadStatus(userId, extract.id);

    if (readStatus) {
      setRead(true);
    }
  };

  const fetchExtract = async () => {
    const user = await getUserSession();
    if (user) {
      setUserid(user.id);
      const extract = await getExtract(id);

      if (extract) {
        setExtract(extract);

        await checkForActiveSubscription(user.id, extract);
        await setInitialReadStatus(user.id, extract);
      } else {
        router.push("/");
      }

      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (clipRef.current) {
      clipRef.current.bounce();
    }

    const link = `http://localhost:8081/share_text/${extract.id}`;
    await Clipboard.setStringAsync(link);
    setShowTooltip(true);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1500);
  };

  function toggleLike() {
    if (heartRef.current) {
      heartRef.current.bounce();
    }

    setLike(!like);
  }

  function shop() {
    if (cartRef.current) {
      cartRef.current.bounce();
    }
  }

  const bounceRef = useRef<any>(null);
  const heartRef = useRef<any>(null);
  const cartRef = useRef<any>(null);
  const clipRef = useRef<any>(null);

  async function subscribe() {
    if (bounceRef.current) {
      bounceRef.current.bounce();
    }

    if (subscribed) {
      await deactivateSubscription(subid, userid, extract.chapter);
    } else {
      await activateSubscription(subid, extract.chapter + 1, userid);
    }
  }

  async function toggleReadStatus() {
    if (read) {
      await markAsUnread(userid, extract);
    } else {
      await markAsRead(userid, extract);
    }
  }

  useEffect(() => {
    fetchExtract();

    const updateListener = supabase
      .channel("insert-subscriptions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscriptions",
          filter: `id=eq.${subid}`,
        },
        (payload) => {
          console.log("Subscription active status changed:", payload);
          setSubscribed((subscribed) => !subscribed);
        }
      )
      .subscribe();

    const addAchievementToProfile = async (userid: string, title: string) => {
      const achievementAdded = await awardAchievement(userid, title);
      return achievementAdded;
    };

    const displayToast = (message: string) => {
      Toast.show({
        type: "achievementUnlocked",
        text1: "Achievement Unlocked",
        text2: message,
      });
    };

    // const popNotification = (title: string, body: string) => {
    //   if (Platform.OS === "android") {
    //     Notifications.scheduleNotificationAsync({
    //       content: {
    //         title: title,
    //         body: body,
    //       },
    //       trigger: null,
    //     });
    //   }
    // };

    const readListener = supabase
      .channel("update-read-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userid}`,
        },
        (payload) => {
          const currentReadExtracts = payload.new.readExtracts || [];
          const isRead = currentReadExtracts.some(
            (item: ExtractType) => item.id === extract.id
          );
          setRead(isRead);

          const checkForAchievement = async () => {
            if (payload.new.readCount !== payload.old.readCount) {
              if (payload.new.readCount === 1) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Good Job Little Buddy"
                );
                if (Platform.OS === "android") {
                  if (achievementAdded) {
                    displayToast("Good Job Little Buddy +20000xp");
                  }
                }
              } else if (payload.new.readCount === 10) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Bookworm"
                );
                if (Platform.OS === "android") {
                  if (achievementAdded) {
                    displayToast("Bookworm +100xp");
                  }
                }
              } else if (payload.new.readCount === 25) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Bibliophile"
                );
                if (Platform.OS === "android") {
                  if (achievementAdded) {
                    displayToast("Bibliophile +250xp");
                  }
                }
              } else if (payload.new.readCount === 50) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Book Enjoyer"
                );
                if (Platform.OS === "android") {
                  if (achievementAdded) {
                    displayToast("Book Enjoyer +500xp");
                  }
                }
              } else if (payload.new.readCount === 100) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Voracious Reader"
                );
                if (Platform.OS === "android") {
                  if (achievementAdded) {
                    displayToast("Voracious Reader +1000xp");
                  }
                }
              } else if (payload.new.readCount === 200) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "We are not the same"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("We are Not the Same +2000xp");
                  }
                }
              }
            }

            if (payload.new.subscribedCount !== payload.old.subscribedCount) {
              if (payload.new.subscribedCount === 1) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "This looks nice"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("This looks nice +20000xp");
                  }
                }
              } else if (payload.new.subscribedCount === 10) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Magpie"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("Magpie +100xp");
                  }
                }
              } else if (payload.new.subscribedCount === 25) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Collector"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("Collector +250xp");
                  }
                }
              } else if (payload.new.subscribedCount === 50) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Archivist"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("Archivist +500xp");
                  }
                }
              } else if (payload.new.subscribedCount === 100) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Book Otaku"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("Book Otaku +1000xp");
                  }
                }
              } else if (payload.new.subscribedCount === 200) {
                const achievementAdded = await addAchievementToProfile(
                  userid,
                  "Hoarder"
                );
                if (Platform.OS == "android") {
                  if (achievementAdded) {
                    displayToast("Hoarder +2000xp");
                  }
                }
              }
            }
          };
          checkForAchievement();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(updateListener);
      supabase.removeChannel(readListener);
    };
  }, [subid]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.container,
        warmth === 4 && { backgroundColor: "#F6F7EB" },
      ]}
    >
      <ScrollView
        style={[
          styles.paper,
          { backgroundColor: brightnessHex[warmth], flex: 1 },
        ]}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#393E41" />
        ) : (
          <View>
            <View>
              <View style={styles.adjustFontSize}>
                <TouchableOpacity
                  style={[
                    styles.fontUp,
                    warmth === 4 && { backgroundColor: "#F6F7EB" },
                  ]}
                  onPress={fontUp}
                >
                  <Ionicons name="text" size={24} color="#393E41"></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontDown,
                    warmth === 4 && { backgroundColor: "#F6F7EB" },
                  ]}
                  onPress={fontDown}
                >
                  <Ionicons name="text" size={18} color="#393E41"></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.brightness,
                    warmth === 4 && { backgroundColor: "#F6F7EB" },
                  ]}
                  onPress={adjustBrightness}
                >
                  <Ionicons
                    name="sunny-outline"
                    size={18}
                    color="#393E41"
                  ></Ionicons>
                </TouchableOpacity>
              </View>
              <View style={styles.titleBar}>
                <Text
                  style={[styles.title, warmth === 4 && { color: "#F6F7EB" }]}
                >
                  {extract.title}
                </Text>
                <Text
                  style={[styles.chapter, warmth === 4 && { color: "#F6F7EB" }]}
                >
                  {extract.chapter}
                </Text>
              </View>
              <GestureDetector
                gesture={Gesture.Exclusive(doubleTap, singleTap)}
              >
                <TouchableOpacity onLongPress={adjustBrightness}>
                  <Text
                    style={[
                      styles.extractText,
                      { fontSize },
                      warmth === 4 && {
                        color: "#F6F7EB",
                        borderBottomColor: "#F6F7EB",
                      },
                    ]}
                  >
                    {extract.fulltext}
                  </Text>
                </TouchableOpacity>
              </GestureDetector>
            </View>
            <View style={styles.markAsReadContainer}>
              <TouchableOpacity
                style={
                  read
                    ? warmth === 4
                      ? styles.markAsUnreadDarkMode
                      : styles.markAsUnread
                    : warmth === 4
                    ? styles.buttonPrimaryDarkMode
                    : styles.buttonPrimary
                }
                onPress={toggleReadStatus}
              >
                {read ? (
                  <Text
                    style={[
                      styles.markAsUnreadText,
                      warmth === 4 && { color: "#F6F7EB" },
                    ]}
                  >
                    Mark as Unread
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.markAsReadText,
                      warmth === 4 && { color: "#393E41" },
                    ]}
                  >
                    Mark as Read
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.engagementButtons}>
              <TouchableOpacity onPress={toggleLike}>
                <BounceView ref={heartRef}>
                  <Ionicons
                    name={like ? "heart" : "heart-outline"}
                    size={24}
                    color="#D64045"
                  />
                </BounceView>
              </TouchableOpacity>
              <View style={styles.subscribeContainer}>
                <TouchableOpacity onPress={subscribe}>
                  <BounceView ref={bounceRef}>
                    <Ionicons
                      name={subscribed ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color="#FE7F2D"
                    />
                  </BounceView>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.bookmarkText,
                    warmth === 4 && { color: "#F6F7EB" },
                  ]}
                >
                  Subscribe: new chapter next week
                </Text>
              </View>
              <View style={styles.shoppingContainer}>
                <BounceView ref={cartRef}>
                  <TouchableOpacity onPress={shop}>
                    <Ionicons name="cart" size={24} color="#77966D" />
                  </TouchableOpacity>
                </BounceView>
                <Text
                  style={[
                    styles.shoppingText,
                    warmth === 4 && { color: "#F6F7EB" },
                  ]}
                >
                  Buy a high quality edition of the full text
                </Text>
              </View>
              <TouchableOpacity onPress={copyToClipboard}>
                <BounceView ref={clipRef}>
                  <Ionicons name="clipboard" size={24} color="#8980F5" />
                </BounceView>
              </TouchableOpacity>
              {showTooltip && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>Copied!</Text>
                </View>
              )}
            </View>
            <View>
              <TouchableOpacity
                style={styles.returnAnchor}
                onPress={backToFeed}
              >
                <Ionicons name="arrow-back" size={24} color="#8980F5" />
                <Text
                  style={[
                    styles.shoppingText,
                    warmth === 4 && { color: "#F6F7EB" },
                  ]}
                >
                  Return to Feed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393E41",
    width: "100%",
    height: "100%",
  },
  titleBar: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "EBGaramondItalic",
    fontSize: 24,
    marginBottom: 8,
  },
  chapter: {
    fontFamily: "EBGaramond",
    fontSize: 18,
    marginBottom: 16,
  },
  paper: {
    backgroundColor: "#F6F7EB",
    width: "90%",
    padding: 16,
  },
  extractText: {
    fontFamily: "EBGaramond",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#393E41",
    paddingBottom: 16,
    borderStyle: "dotted",
  },
  engagementButtons: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  subscribeContainer: {
    alignItems: "center",
    maxWidth: 120,
  },
  markAsReadContainer: {
    alignItems: "center",
    color: "#F6F7EB",
  },
  shoppingContainer: {
    alignItems: "center",
    maxWidth: 120,
  },
  bookmarkText: {
    textAlign: "center",
    fontFamily: "QuicksandReg",
  },
  shoppingText: {
    textAlign: "center",
    fontFamily: "QuicksandReg",
  },
  discuss: {
    fontFamily: "EBGaramond",
    fontSize: 36,
    marginTop: 8,
  },
  addCommentTextarea: {
    borderWidth: 1,
    borderColor: "#393E41",
    padding: 8,
    borderRadius: 8,
    fontFamily: "QuicksandReg",
    marginTop: 8,
  },
  submitCommentButton: {
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  markAsReadText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  returnAnchor: {
    alignItems: "center",
  },
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  buttonPrimaryDarkMode: {
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  markAsUnread: {
    marginTop: 8,
    padding: 16,
    borderColor: "#393E41",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  markAsUnreadDarkMode: {
    marginTop: 8,
    padding: 16,
    borderColor: "#F6F7EB",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  markAsUnreadText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  tooltip: {
    position: "absolute",
    top: -30,
    left: "90%",
    transform: [{ translateX: -30 }],
    backgroundColor: "#393E41",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    elevation: 10,
  },
  tooltipText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 14,
  },
  adjustFontSize: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  fontUp: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  fontDown: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  brightness: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
