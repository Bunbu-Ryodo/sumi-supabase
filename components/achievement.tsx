import { AchievementTypeClient } from "../types/types";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Achievement({
  id,
  title,
  description,
  score,
  icon,
  date,
}: AchievementTypeClient) {
  return (
    <View style={styles.achievementsRow}>
      <View style={styles.achievementIcon}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={"#F6F7EB"}
        ></Ionicons>
      </View>
      <View style={styles.achievementDetails}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDescription}>
          {description} +{score}
        </Text>
        <Text style={styles.achievementDescription}>
          Achieved on:{" "}
          {new Date(date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <View style={styles.achievementProgressBar}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  achievementsRow: {
    flexDirection: "row",
    padding: 8,
  },
  achievementIcon: {
    height: 48,
    width: 48,
    borderRadius: 8,
    backgroundColor: "#393E41",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  inProgressIcon: {
    height: 48,
    width: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#393E41",
    marginRight: 16,
  },
  achievementTitle: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  achievementDescription: {
    marginTop: 4,
    fontFamily: "QuicksandReg",
    maxWidth: 200,
    fontSize: 14,
  },
  readerScoreContainer: {
    flexDirection: "row",
  },
  achievementProgressBar: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FE7F2D",
    borderRadius: 40,
    height: 14,
    borderWidth: 1,
    borderColor: "#393E41",
  },
  achievementDetails: {
    minWidth: 200,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  score: {
    fontSize: 24,
    fontFamily: "EBGaramond",
  },
});
