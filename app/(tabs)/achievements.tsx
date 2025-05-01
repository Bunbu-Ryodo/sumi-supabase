import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  getUserSession,
  lookUpUserProfile,
} from "../../supabase_queries/auth.js";
import Achievement from "../../components/achievement";
import PendingAchievement from "../../components/pendingAchievement";
import {
  AchievementTypeClient,
  PendingAchievementType,
} from "../../types/types.js";
import { fetchAchievementByDescription } from "../../supabase_queries/achievements";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [achievementScore, setAchievementScore] = useState(0);
  const [readerTag, setReaderTag] = useState("");
  const [readCount, setReadCount] = useState(0);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [pendingAchievements, setPendingAchievements] = useState<
    PendingAchievementType[]
  >([]);
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
          setReadCount(userProfile.readCount);
          setSubscribedCount(userProfile.subscribedCount);
          calculateInProgressAchievements();
          setLoading(false);
        }
      }
    };
    getProfileData();
  }, []);

  const calculateInProgressAchievements = async () => {
    let inProgressAchievements = [];
    let inProgress;

    if (readCount < 10) {
      const progress = (readCount / 10) * 100;
      const achievement = await fetchAchievementByDescription(
        "Read 10 extracts"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (readCount < 25) {
      const progress = (readCount / 25) * 100;
      const achievement = await fetchAchievementByDescription(
        "Read 25 extracts"
      );
      inProgress = { ...achievement, progress };
    } else if (readCount < 50) {
      const progress = (readCount / 50) * 100;
      const achievement = await fetchAchievementByDescription(
        "Read 50 extracts"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (readCount < 100) {
      const progress = readCount;
      const achievement = await fetchAchievementByDescription(
        "Read 100 extracts"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (readCount < 200) {
      const progress = (readCount / 200) * 100;
      const achievement = await fetchAchievementByDescription(
        "Read 200 extracts"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    }

    if (subscribedCount < 10) {
      const progress = (readCount / 10) * 100;
      const achievement = await fetchAchievementByDescription(
        "Subscribe to 10 series"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (subscribedCount < 25) {
      const progress = (readCount / 25) * 100;
      const achievement = await fetchAchievementByDescription(
        "Subscribe to 25 series"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (subscribedCount < 50) {
      const progress = (readCount / 50) * 100;
      const achievement = await fetchAchievementByDescription(
        "Subscribe to 50 series"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (subscribedCount < 100) {
      const progress = readCount;
      const achievement = await fetchAchievementByDescription(
        "Subscribe to 100 series"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    } else if (subscribedCount < 200) {
      const progress = (readCount / 200) * 100;
      const achievement = await fetchAchievementByDescription(
        "Subscribe to 200 series"
      );
      inProgress = { ...achievement, achievementProgress: progress };
    }

    if (inProgress) {
      inProgressAchievements.push(inProgress);
    }
    setPendingAchievements(inProgressAchievements);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sumi</Text>
      <Text style={styles.tagline}>Just One More Chapter</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#393E41" />
      ) : (
        <View style={styles.achievementsWrapper}>
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
          <Text style={styles.completedAchievementsHeader}>
            Completed Achievements
          </Text>
          <View style={styles.completedAchievementsContainer}>
            {achievements ? (
              achievements.map((row: AchievementTypeClient) => (
                <Achievement
                  id={row.id}
                  key={row.id}
                  title={row.title}
                  description={row.description}
                  score={row.score}
                  date={row.date}
                  icon={row.icon}
                />
              ))
            ) : (
              <Text>Read Some Book</Text>
            )}
          </View>
          <Text style={styles.pendingAchievementsHeader}>
            Pending Achievements
          </Text>
          <View style={styles.pendingAchievementsContainer}>
            {pendingAchievements.length > 0 ? (
              pendingAchievements.map((row: PendingAchievementType) => (
                <PendingAchievement
                  id={row.id}
                  key={row.id}
                  title={row.title}
                  description={row.description}
                  score={row.score}
                  icon={row.icon}
                  achievementProgress={row.achievementProgress}
                />
              ))
            ) : (
              <Text style={styles.nameAndScore}>No pending achievements</Text>
            )}
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
  completedAchievementsContainer: {
    marginTop: 12,
    width: "90%",
    maxWidth: 368,
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    padding: 16,
    justifyContent: "space-evenly",
  },
  completedAchievementsHeader: {
    marginTop: 16,
    textDecorationLine: "underline",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  pendingAchievementsContainer: {
    marginTop: 12,
    width: "90%",
    maxWidth: 368,
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    padding: 16,
    justifyContent: "space-evenly",
  },
  pendingAchievementsHeader: {
    marginTop: 16,
    textDecorationLine: "underline",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  achievementsWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
