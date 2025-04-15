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

export default function EReader() {
  let { id } = useLocalSearchParams();

  const [extract, setExtract] = useState<ExtractType>({
    id: "",
    title: "",
    author: "",
    chapter: 0,
    year: "",
    previewtext: "",
    fulltext: "",
    portrait: "",
    coverart: "",
    textid: "",
    subscribeart: "",
  });

  const [loading, setLoading] = useState(true);

  type CommentType = {
    id: string;
    extractId: string;
    message: string;
    readerTag: string;
    userId: string;
    time: string;
    likes: number;
  };

  const [like, setLike] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);

  const copyToClipboard = async () => {
    const link = `http://localhost:8081/share_text/${extract.id}`;
    await Clipboard.setStringAsync(link);
    Alert.alert("Link to extract copied to clipboard!");
  };

  function toggleLike() {
    setLike(!like);
  }

  async function toggleSubscribe() {
    await setSubscribe((prevState) => {
      const subscribed = !prevState;

      if (subscribed) {
        subscribeToSeries();
      } else if (!subscribed) {
        unsubscribeFromSeries();
      }

      return subscribed;
    });
  }

  async function subscribeToSeries() {}

  async function unsubscribeFromSeries() {}

  const router = useRouter();

  const getComments = async () => {};

  const postComment = async () => {};

  const checkSubscriptions = async (textId: string) => {};

  const fetchExtract = async () => {
    const { data, error } = await getExtract(id);

    if (data) {
      setExtract(data);
    } else {
      console.error("Error fetching extract:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExtract();
  }, []);

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
                <TouchableOpacity onPress={toggleSubscribe}>
                  <Ionicons
                    name={subscribe ? "bookmark" : "bookmark-outline"}
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
