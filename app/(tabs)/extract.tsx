import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  createNewProfile,
  lookUpUserProfile,
  getUserSession,
} from "../../supabase_queries/auth.js";
import { getExtracts } from "../../supabase_queries/feed.js";
import supabase from "../../lib/supabase.js";
import { ExtractType } from "../../types/types.js";
import Extract from "../../components/extract";

export default function FeedScreen() {
  const router = useRouter();
  const [extracts, setExtracts] = useState([] as ExtractType[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthenticated = async function () {
      const user = await getUserSession();

      if (!user) {
        router.push("/");
      } else if (user) {
        const userProfile = await lookUpUserProfile(user.id);
        if (!userProfile) {
          await createNewProfile(user.id, new Date());
        }
        await fetchExtracts();
      }
    };
    checkUserAuthenticated();
  }, []);

  const Logout = async function () {
    await supabase.auth.signOut();
    router.push("/");
  };

  const fetchExtracts = async function () {
    const { data, error } = await getExtracts();
    if (error) {
      console.error("Error fetching extracts:", error);
    } else {
      if (data) {
        setExtracts(data);
      } else {
        setExtracts([]);
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#F6F7EB" />
      ) : (
        <TouchableOpacity style={styles.buttonPrimary} onPress={Logout}>
          <Text style={styles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
      {extracts.length > 0 && <Text>Done</Text>}

      {extracts &&
        extracts.map((extract: ExtractType, index: number) => (
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
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center", // Center the Extract components horizontally
    paddingVertical: 24, // Add some vertical padding if needed
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
});
