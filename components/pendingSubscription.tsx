import { View, Image, Text, StyleSheet } from "react-native";
import { SubscriptionTypeClient } from "../types/types.js";

export default function PendingSubscription({
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
        <View>
          <Text style={styles.upcoming}>Upcoming Instalment</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.chapter}>Chapter {chapter}</Text>
          <Text style={styles.date}>Next chapter arrives</Text>
          <Text style={styles.date2}>{nextInstalmentDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    width: "100%",
  },
  subscriptionWrapper: {
    width: "100%",
    margin: 8,
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
  title: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginTop: 8,
    marginRight: 12,
  },
  upcoming: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginTop: 8,
    marginRight: 12,
    color: "#FE7F2D",
  },
  author: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  chapter: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  daysuntil: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
    color: "#D64045",
  },
  date: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
    color: "#8980F5",
  },
  date2: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
    marginBottom: 8,
    color: "#8980F5",
  },
});
