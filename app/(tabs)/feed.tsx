import { StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  createNewProfile,
  lookUpUserProfile,
  getUserSession,
} from "../../supabase_queries/auth.js";
import supabase from "../../lib/supabase.js";

export default function FeedScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserAuthenticated = async function () {
      const user = await getUserSession();

      if (!user) {
        router.push("/");
      } else if (user) {
        const userProfile = await lookUpUserProfile(user.id);
        if (!userProfile) {
          const newUserProfile = await createNewProfile(user.id, new Date());
          console.log(newUserProfile);
        }
      }
    };
    checkUserAuthenticated();
  }, []);

  const Logout = async function () {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <TouchableOpacity style={styles.buttonPrimary} onPress={Logout}>
        <Text style={styles.primaryButtonText}>Logout</Text>
      </TouchableOpacity>
      {/* {extracts &&
        extracts.map((extract: Extract, index: number) => (
          <Extract
            key={index}
            id={extract.id}
            textId={extract.textId}
            author={extract.author}
            title={extract.title}
            year={extract.year}
            chapter={extract.chapter}
            previewText={extract.previewText}
            portrait={extract.portrait}
            thumbnail={extract.coverArt}
          />
        ))} */}
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
