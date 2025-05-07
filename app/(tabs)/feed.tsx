import { StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  createNewProfile,
  lookUpUserProfile,
  getUserSession,
} from "../../supabase_queries/auth.js";
import { getExtracts } from "../../supabase_queries/feed";
import {
  getAllDueSubscriptions,
  getExtractByTextIdChapter,
  createInstalment,
  updateSubscription,
} from "../../supabase_queries/subscriptions";
import { ExtractType } from "../../types/types.js";
import Extract from "../../components/extract";

export default function FeedScreen() {
  const router = useRouter();
  const [extracts, setExtracts] = useState([] as ExtractType[]);

  useEffect(() => {
    const checkUserAuthenticated = async function () {
      const user = await getUserSession();

      if (!user) {
        router.push("/");
      } else if (user) {
        checkUserProfileStatus(user.id);
        await fetchExtracts();
        await processSubscriptions(user.id);
      }
    };
    checkUserAuthenticated();
  }, []);

  const checkUserProfileStatus = async function (userId: string) {
    const userProfile = await lookUpUserProfile(userId);
    if (!userProfile) {
      const userProfile = await createNewProfile(userId, new Date());
    }
  };

  const processSubscriptions = async function (userId: string) {
    const subscriptions = await getAllDueSubscriptions(userId);
    if (subscriptions) {
      for (let i = 0; i < subscriptions.length; i++) {
        const extract = await getExtractByTextIdChapter(
          subscriptions[i].textid,
          subscriptions[i].chapter
        );

        if (extract) {
          const updatedSubscription = await updateSubscription(
            subscriptions[i].id,
            subscriptions[i].chapter + 1
          );

          if (updatedSubscription) {
            console.log(
              "Subscription updated successfully:",
              updatedSubscription
            );

            const newInstalment = await createInstalment(
              userId,
              extract.id,
              extract.chapter,
              extract.title,
              extract.author,
              updatedSubscription[i].id,
              updatedSubscription[i].subscribeart,
              updatedSubscription[i].due
            );

            if (newInstalment) {
              console.log("Instalment created successfully:", newInstalment);
            }
          }
        }
      }
    } else {
      console.log("Subscriptions up to date");
    }
  };

  const fetchExtracts = async function () {
    const extracts = await getExtracts();
    if (extracts) {
      setExtracts(extracts);
    } else {
      setExtracts([]);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.feedWrapper}
      style={styles.container}
    >
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
  feedWrapper: {
    alignItems: "center",
    paddingVertical: 24,
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
