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
    <View style={styles.achievement}>
      <View style={styles.achievementIcon}></View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.date}>Date: {date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  achievement: {
    flexDirection: "row",
  },
  achievementIcon: {
    borderRadius: 2,
    backgroundColor: "#393E41",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {},
  title: {},
  description: {},
  score: {},
  date: {},
});
