import supabase from "../lib/supabase";
import { AchievementType } from "../types/types";

export async function awardAchievement(userId: string, title: string){
    const { data: achievement, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("title", title)
    .single();

    if (error) {
        console.error("Error fetching achievement:", error);
        return null;
    } else {
        const { data: profileData, error: profileFetchError } = await supabase
        .from("profiles")
        .select("achievements, achievementScore")
        .eq("user_id", userId)
        .single();

        if (profileFetchError) {
            console.error("Error fetching profile data:", profileFetchError);
            return null;
        } else {
            const currentAchievements = profileData.achievements || [];
            const alreadyExists = currentAchievements.some((ach: AchievementType) => ach.id === achievement.id);

            if(alreadyExists){
                console.log("Achievement already exists in profile:", achievement.title);
                return null;
            }

            achievement.date = new Date().getTime();

            const updatedAchievements = [...currentAchievements, achievement];

            console.log("Updated Achievements:", updatedAchievements);
            console.log("Achievement Score:", profileData.achievementScore + achievement.score);

            const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({ achievements: updatedAchievements, achievementScore: profileData.achievementScore + achievement.score })
            .eq("user_id", userId)
            .single();

            console.log("Updated Profile:", updatedProfile);

            if (updateError) {
                console.error("Error updating profile with new achievement:", updateError);
                return null;
            } else {
                return updatedProfile;
            }
        }
    }

}