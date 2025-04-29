import supabase from "../lib/supabase";
import { ExtractType } from "../types/types";

export async function markAsRead(userId: string, extract: ExtractType){
   const { data: currentReadExtracts, error: fetchError } = await supabase
   .from("profiles")
   .select("readExtracts, readCount")
   .eq("user_id", userId)
   .single();

   if(fetchError){
    console.error("Error fetching current read extracts:", fetchError);
    return;
   } else {
    const currentReadExtractsArray = currentReadExtracts.readExtracts || [];

    if (currentReadExtractsArray.some((item: ExtractType) => item.id === extract.id)) {
      console.log("Extract already marked as read:", extract.id);
      return;
    }

    const updatedReadExtracts = [...currentReadExtractsArray, extract];

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ readExtracts: updatedReadExtracts, readCount: currentReadExtracts.readCount + 1 })
      .eq("user_id", userId)
      .single();

    if (updateError) {
      console.error("Error updating read extracts:", updateError);
    } else {
      console.log("Successfully marked extract as read:", updatedProfile);
    }
   }
}

export async function markAsUnread(userId: string, extract: ExtractType){
    const { data: currentReadExtracts, error: fetchError } = await supabase
    .from("profiles")
    .select("readExtracts, readCount")
    .eq("user_id", userId)
    .single();
    
    if(fetchError){
     console.error("Error fetching current read extracts:", fetchError);
     return;
    } else {
     const currentReadExtractsArray = currentReadExtracts.readExtracts || [];
    
     const updatedReadExtracts = currentReadExtractsArray.filter((item: ExtractType) => item.id !== extract.id);
    
     const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ readExtracts: updatedReadExtracts, readCount: currentReadExtracts.readCount - 1 })
        .eq("user_id", userId)
        .single();
    
     if (updateError) {
        console.error("Error updating read extracts:", updateError);
     } else {
        console.log("Successfully marked extract as unread:", updatedProfile);
     }
    }
}