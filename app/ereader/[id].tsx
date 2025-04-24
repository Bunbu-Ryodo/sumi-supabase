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
      deactivateSubscription(subid);
    } else {
      activateSubscription(subid);
    }
  }

  const router = useRouter();

  const fetchExtract = async () => {
    const user = await getUserSession();
    if (user) {
      const { data: extract, error } = await getExtract(id);

      if (extract) {
        setExtract(extract);

        const subscriptionData = await checkForSubscription(
          user.id,
          extract.textid
        );

        if (subscriptionData.data && subscriptionData.data.length > 0) {
          if (
            subscriptionData.data[0].active &&
            subscriptionData.data[0].textid === extract.textid
          ) {
            setSubscribed(true);
          }
          setSubid(subscriptionData.data[0].id);
        } else {
          const { insertData } = await createSubscription(
            user.id,
            extract.textid,
            extract.chapter + 1,
            new Date()
          );

          if (insertData) {
            setSubid(insertData.id);
          } else {
            console.error("Error creating subscription:", insertData);
          }
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

    return () => {
      supabase.removeChannel(updateListener);
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
                <TouchableOpacity style={styles.returnContainer}>
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
  submitCommentText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  returnAnchor: {
    alignItems: "center",
  },
  returnContainer: {},
});
