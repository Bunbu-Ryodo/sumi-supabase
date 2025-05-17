import { View, Image, Text, StyleSheet } from "react-native";
import { SubscriptionTypeClient } from "../types/types.js";

export default function PendingInstalment({
  id,
  title,
  author,
  chapter,
  due,
  subscribeart,
}: SubscriptionTypeClient) {
  const nextInstalmentDate = new Date(due).toLocaleDateString("en-GB", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.subscriptionWrapper}>
      <View key={id} style={styles.subscriptionButton}>
        <Image style={styles.imageIcons} source={{ uri: subscribeart }} />
        <View style={styles.detailsPanel}>
          <Text style={[styles.details, styles.upcomingInstalment]}>
            Upcoming Instalment
          </Text>
          <Text style={styles.details}>{title}</Text>
          <Text style={styles.details}>{author}</Text>
          <Text style={styles.details}>Chapter {chapter}</Text>
          <Text style={styles.details}>Next chapter arrives</Text>
          <Text style={styles.details}>{nextInstalmentDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionButton: {
    flexDirection: "row",
    borderRadius: 8,
    width: "100%",
  },
  subscriptionWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
  },
  imageIcons: {
    height: 100,
    width: 90,
    borderRadius: 8,
    margin: 8,
  },
  noSubscribes: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  detailsPanel: {
    padding: 8,
  },
  details: {
    fontFamily: "QuicksandReg",
    fontSize: 12,
  },
  upcomingInstalment: {
    color: "#FE7F2D",
  },
});
