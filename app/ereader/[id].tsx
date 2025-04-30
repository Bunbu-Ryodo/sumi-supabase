import * as Clipboard from "expo-clipboard";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export default function EReader() {
  let { id } = useLocalSearchParams();

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

  const copyToClipboard = async () => {
    const link = `http://localhost:8081/share_text/${extract.id}`;
    await Clipboard.setStringAsync(link);
    Alert.alert("Link to extract copied to clipboard!");
  };

  function toggleLike() {
    setLike(!like);
  }

  async function subscribe() {
    if (subscribed) {
      deactivateSubscription(subid, userid);
    } else {
      activateSubscription(subid, extract.chapter + 1, userid);
    }
  }

  async function toggleReadStatus() {
    if (read) {
      await markAsUnread(userid, extract);
    } else {
      await markAsRead(userid, extract);
    }
  }

  const router = useRouter();

  const fetchExtract = async () => {
    const user = await getUserSession();
    if (user) {
      setUserid(user.id);
      const { data: extract, error } = await getExtract(id);

      if (extract) {
        setExtract(extract);

        const { data: existingSubscriptionData } = await checkForSubscription(
          user.id,
          extract.textid
        );

        if (existingSubscriptionData) {
          if (
            existingSubscriptionData.active &&
            existingSubscriptionData.textid === extract.textid
          ) {
            setSubscribed(true);
          }
          setSubid(existingSubscriptionData.id);
        } else {
          const { data: insertData, error: insertError } =
            await createSubscription(
              user.id,
              extract.textid,
              extract.chapter + 1,
              new Date().getTime(),
              extract.subscribeart
            );

          console.log("Insert data:", insertData);

          if (insertData) {
            console.log("Subscription created successfully:", insertData);
            setSubid(insertData.id);
          } else if (insertError) {
            console.error("Error creating subscription:", insertError);
          }
        }

        const readStatus = await checkReadStatus(user.id, extract.id);

        if (readStatus) {
          setRead(true);
        }
      } else {
        console.error("Error fetching extract:", error);
      }
    } else {
      router.push("/");
    }

    setLoading(false);
  };

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
          console.log("Insert event:", payload);
          setSubscribed((subscribed) => !subscribed);
        }
      )
      .subscribe();

    const addAchievementToProfile = async (userid: string, title: string) => {
      await awardAchievement(userid, title);
    };

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
          console.log("Profile status change", payload);
          const currentReadExtracts = payload.new.readExtracts || [];
          const isRead = currentReadExtracts.some(
            (item: ExtractType) => item.id === extract.id
          );
          setRead(isRead);

          if (payload.new.readCount !== payload.old.readCount) {
            if (payload.new.readCount === 1) {
              addAchievementToProfile(userid, "Good Job Little Buddy");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'Good Job Little Buddy: Read 1 text' 20000 xp points"
              );
            } else if (payload.new.readCount === 10) {
              addAchievementToProfile(userid, "Bookworm");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'Bookworm: Read 10 texts' 100 xp points"
              );
            } else if (payload.new.readCount === 25) {
              addAchievementToProfile(userid, "Bibliophile");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'Bibliophile: Read 25 texts' 250 xp points"
              );
            } else if (payload.new.readCount === 50) {
              addAchievementToProfile(userid, "Book Enjoyer");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'Book Enjoyer: Read 50 texts' 500 xp points"
              );
            } else if (payload.new.readCount === 100) {
              addAchievementToProfile(userid, "Voracious Reader");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'Voracious Reader: Read 100 texts' 1000 xp points"
              );
            } else if (payload.new.readCount === 200) {
              addAchievementToProfile(userid, "We are not the same");
              Alert.alert(
                "Achievement Unlocked!",
                "You've Earned 'We Are Not the Same: Read 200 texts' 2000 xp points"
              );
            }
          }

          if (payload.new.subscribedCount !== payload.old.subscribedCount) {
            if (payload.new.subscribedCount === 1) {
              addAchievementToProfile(userid, "This looks nice");
              Alert.alert(
                "Achievement Unlocked!",
                "This looks nice: Subscribe to 1 series' 20000 xp points"
              );
            } else if (payload.new.subscribedCount === 10) {
              addAchievementToProfile(userid, "Magpie");
              Alert.alert(
                "Achievement Unlocked!",
                "Magpie: Subscribe to 10 series' 100 xp points"
              );
            } else if (payload.new.subscribedCount === 25) {
              addAchievementToProfile(userid, "Collector");
              Alert.alert(
                "Achievement Unlocked!",
                "Collector: Subscribe to 25 series' 250 xp points"
              );
            } else if (payload.new.subscribedCount === 50) {
              addAchievementToProfile(userid, "Archivist");
              Alert.alert(
                "Achievement Unlocked!",
                "Archivist: Subscribe to 50 series' 500 xp points"
              );
            } else if (payload.new.subscribedCount === 100) {
              addAchievementToProfile(userid, "Book Otaku");
              Alert.alert(
                "Achievement Unlocked!",
                "Book Otaku: Subscribe to 100 series' 1000 xp points"
              );
            } else if (payload.new.subscribedCount === 200) {
              addAchievementToProfile(userid, "Hoarder");
              Alert.alert(
                "Achievement Unlocked!",
                "Book Otaku: Subscribe to 200 series' 2000 xp points"
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(updateListener);
      supabase.removeChannel(readListener);
    };
  }, [subid]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView style={styles.paper}>
        {loading ? (
          <ActivityIndicator size="large" color="#F6F7EB" />
        ) : (
          <View>
            <View>
              <View style={styles.titleBar}>
                <Text style={styles.title}>{extract.title}</Text>
                <Text style={styles.chapter}>{extract.chapter}</Text>
              </View>
              <Text style={styles.extractText}>{extract.fulltext}</Text>
            </View>
            <View style={styles.markAsReadContainer}>
              <TouchableOpacity
                style={!read ? styles.buttonPrimary : styles.markAsUnread}
                onPress={toggleReadStatus}
              >
                {read ? (
                  <Text style={styles.markAsUnreadText}>Mark as Unread</Text>
                ) : (
                  <Text style={styles.markAsReadText}>Mark as Read</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.engagementButtons}>
              <TouchableOpacity onPress={toggleLike}>
                <Ionicons
                  name={like ? "heart" : "heart-outline"}
                  size={24}
                  color="#D64045"
                />
              </TouchableOpacity>
              <View style={styles.subscribeContainer}>
                <TouchableOpacity onPress={subscribe}>
                  <Ionicons
                    name={subscribed ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color="#FE7F2D"
                  />
                </TouchableOpacity>
                <Text style={styles.bookmarkText}>
                  Subscribe: new chapter next week
                </Text>
              </View>
              <View style={styles.shoppingContainer}>
                <TouchableOpacity>
                  <Ionicons name="cart-outline" size={24} color="#77966D" />
                </TouchableOpacity>
                <Text style={styles.shoppingText}>
                  Buy a high quality edition of the full text
                </Text>
              </View>
              <TouchableOpacity onPress={copyToClipboard}>
                <Ionicons name="clipboard-outline" size={24} color="#8980F5" />
              </TouchableOpacity>
            </View>
            <Link style={styles.returnAnchor} href="/feed" asChild>
              <View>
                <TouchableOpacity>
                  <Ionicons name="arrow-back" size={24} color="#8980F5" />
                </TouchableOpacity>
                <Text style={styles.shoppingText}>Return to Feed</Text>
              </View>
            </Link>
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
    fontFamily: "GoudyBookletter",
    fontSize: 24,
    marginBottom: 8,
  },
  chapter: {
    fontFamily: "Merriweather",
    fontSize: 18,
    marginBottom: 16,
  },
  paper: {
    backgroundColor: "#F6F7EB",
    width: "90%",
    padding: 16,
    height: "100%",
  },
  extractText: {
    fontFamily: "Merriweather",
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
    fontFamily: "GoudyBookletter",
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
    borderColor: "#F6F7EB",
    borderWidth: 1,
    backgroundColor: "#393E41",
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
  markAsUnreadText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
