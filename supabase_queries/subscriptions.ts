import supabase from '../lib/supabase';
import { SubscriptionType, InstalmentType, ExtractType } from '../types/types';

export async function createSubscription(userId: string, textId: number, chapter: number, due: number, subscribeart: string)
: Promise<{ data: SubscriptionType | null; error: any }>{
  if (!userId || !textId || !chapter || !due) {
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
  .from('subscriptions')
  .insert({ userid: userId, textid: textId, chapter: chapter, due: due, subscribeart: subscribeart }).select().single()

  if (error) {
    throw new Error(`Error inserting new subscription: ${error.message}`);
  }

  return { data, error};  
}

// export async function deleteSubscription(userId: string, textId: number)
// : Promise<{ data: SubscriptionType[] | null; deleteError: any }>{
//   const { data, error: deleteError } = await supabase
//   .from('subscriptions')
//   .delete()
//   .match({ userid: userId, textid: textId })
//   .select();

  
// if (deleteError) {
//   throw new Error(`Error deleting existing subscription: ${deleteError.message}`);
// }

// return { data, deleteError }

// }

export async function activateSubscription(id: number, chapter: number, userId: string)
: Promise<{ data: SubscriptionType[] | null; error: any }>{
  const { data, error } = await supabase.from('subscriptions').update({active: true, chapter: chapter, due: new Date().getTime()}).eq('id', id).select();

  const { data: profileData, error: profileFetchError } = await supabase
  .from('profiles')
  .select('subscribedCount')
  .eq('user_id', userId)
  .select()
  .single();

  if(profileFetchError){
    console.error("Error fetching profile data:", profileFetchError);
  } else {
    const currentCount = profileData.subscribedCount || 0;
    const newCount = currentCount + 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subscribedCount: newCount })
      .eq('user_id', userId);
    
    if(updateError){
      console.error("Error updating subscription count:", updateError);
    }
  }


  return { data, error };
}

export async function deactivateSubscription(id: number, userId: string)
: Promise<{ data: SubscriptionType[] | null; error: any }>{
  const { data, error } = await supabase.from('subscriptions').update({active: false}).eq('id', id).select();

  const { data: profileData, error: profileFetchError } = await supabase
  .from('profiles')
  .select('subscribedCount')
  .eq('user_id', userId)
  .select()
  .single();

  if(profileFetchError){
    console.error("Error fetching profile data:", profileFetchError);
  } else {
    const currentCount = profileData.subscribedCount || 0;
    const newCount = currentCount - 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subscribedCount: newCount })
      .eq('user_id', userId);
    
    if(updateError){
      console.error("Error updating subscription count:", updateError);
    }
  }

  return { data, error };
}

export async function checkForSubscription(userId: string, textId: number)
: Promise<{ data: SubscriptionType | null; error: any }> {
    if (!userId || !textId) {
        throw new Error("Missing required parameters");
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .select()
        .match({ userid: userId, textid: textId })
        .select()
        .single();

    if(error){
      console.error("Error fetching subscription:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function getAllDueSubscriptions(userId: string) {
  if(!userId){
    throw new Error("Missing required parameters");
  }

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select()
    .match({ userid: userId, active: true })
    .lt('due', new Date().getTime())
    .select();

    if(error){
      console.error("Error fetching due subscriptions:", error.message);
      return null;
    }
    return subscriptions;
}

export async function getExtractByTextIdChapter(textId: number, chapter: number){
  if(!textId){
    throw new Error("Missing required parameters");
  }

  const { data: extract, error } = await supabase
    .from('extracts')
    .select()
    .match({ textid: textId, chapter: chapter })
    .single();

    if(error){
      console.error("Error fetching extract:", error);
      return null;
    }
    return extract;
}

export async function createInstalment(userId: string, extractId: number, chapter: number, title: string, author: string, subscriptionId: number, subscribeart: string){
  if(!userId || !extractId || !chapter || !title || !author){
    throw new Error("Missing required parameters");
  }

  const { data: instalment, error } = await supabase
    .from('instalments')
    .insert({ userid: userId, extractid: extractId, chapter: chapter, title: title, author: author, subscriptionid: subscriptionId, subscribeart: subscribeart })
    .select()
    .single();

    if(error){
      console.error("Error creating instalment:", error);
      return null;

    }

    return instalment;
}

export async function updateSubscription(subscriptionId: number, chapter: number){
  if(!subscriptionId){
    throw new Error("Missing required parameters");
  }

  const { data: updatedSubscription, error } = await supabase
    .from('subscriptions')
    .update({chapter: chapter, due: new Date().getTime() + 604800000}) // 7 days in milliseconds
    .eq('id', subscriptionId)
    .select();

  if(error){
    console.error("Error updating subscription:", error);
    return null;
  }

    return updatedSubscription;
}

export async function getAllInstalments(userId: string){
  if(!userId){
    throw new Error("Missing required parameters");
  }

  const { data: instalments, error } = await supabase
    .from('instalments')
    .select()
    .match({ userid: userId })
    .select();

    if(error){
      console.error("Error fetching instalments:", error);
      return null;
    }

    return instalments;
}