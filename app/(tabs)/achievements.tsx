import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  getUserSession,
  lookUpUserProfile,
} from "../../supabase_queries/auth.js";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [achievementScore, setAchievementScore] = useState(0);
  const [readerTag, setReaderTag] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const getProfileData = async function () {
      const user = await getUserSession();

      if (user) {
        const userProfile = await lookUpUserProfile(user.id);
        if (userProfile) {
          setAchievements(userProfile.achievements || []);
          setAchievementScore(userProfile.achievementScore || 0);
          setReaderTag(userProfile.username || "");
          setLoading(false);
        }
      }
    };
    getProfileData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sumi</Text>
      <Text style={styles.tagline}>Just One More Chapter</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#393E41" />
      ) : (
        <View style={styles.nameAndScoreContainer}>
          <Text style={styles.nameAndScore}>ReaderTag: {readerTag}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.nameAndScore}>Score: {achievementScore}</Text>
            <Ionicons
              style={styles.trophy}
              name="trophy"
              size={16}
              color="#393E41"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F6F7EB",
    width: "100%",
    height: "100%",
    padding: 16,
  },
  header: {
    fontSize: 36,
    fontFamily: "GoudyBookletter",
    color: "#393E41",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "QuicksandReg",
    color: "#393E41",
  },
  nameAndScoreContainer: {
    marginTop: 12,
  },
  nameAndScore: {
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#393E41",
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
  },
  trophy: {
    marginTop: 2,
  },
});
