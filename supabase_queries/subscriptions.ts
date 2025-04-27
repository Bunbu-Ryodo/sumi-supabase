import supabase from '../lib/supabase';
import { SubscriptionType } from '../types/types';

export async function createSubscription(userId: string, textId: number, chapter: number, due: number)
: Promise<{ data: SubscriptionType[] | null; error: any }>{
  if (!userId || !textId || !chapter || !due) {
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
  .from('subscriptions')
  .insert({ userid: userId, textid: textId, chapter: chapter, due: due }).select();

  if (error) {
    throw new Error(`Error inserting new subscription: ${error.message}`);
  }

  return { data, error};  
}

export async function deleteSubscription(userId: string, textId: number)
: Promise<{ data: SubscriptionType[] | null; deleteError: any }>{
  const { data, error: deleteError } = await supabase
  .from('subscriptions')
  .delete()
  .match({ userid: userId, textid: textId })
  .select();

  
if (deleteError) {
  throw new Error(`Error deleting existing subscription: ${deleteError.message}`);
}

return { data, deleteError }


}

export async function activateSubscription(id: number, chapter: number)
: Promise<{ data: SubscriptionType[] | null; error: any }>{
  const { data, error } = await supabase.from('subscriptions').update({active: true, chapter: chapter, due: new Date().getTime()}).eq('id', id).select();

  return { data, error };
}

export async function deactivateSubscription(id: number)
: Promise<{ data: SubscriptionType[] | null; error: any }>{
  const { data, error } = await supabase.from('subscriptions').update({active: false}).eq('id', id).select();

  return { data, error };
}

export async function checkForSubscription(userId: string, textId: number)
: Promise<{ data: SubscriptionType[] | null; error: any }> {
    if (!userId || !textId) {
        throw new Error("Missing required parameters");
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .select()
        .match({ userid: userId, textid: textId })
        .select();

    if(error){
      console.error("Error fetching subscription:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function getAllDueSubscriptions(userId: string) : Promise<{ data: SubscriptionType[] | null; error: any }> {
  if(!userId){
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .match({ userid: userId, active: true })
    .lt('due', new Date().getTime())
    .select();

    return { data, error };
}

export async function getExtractByTextIdChapter(textId: number, chapter: number) : Promise<{ data: any[] | null; error: any }> {
  if(!textId){
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
    .from('extracts')
    .select()
    .match({ textid: textId, chapter: chapter })

    return { data, error };
}

export async function createInstalment(userId: string, extractId: number, chapter: number, title: string, author: string, subscriptionId: number) : Promise<{ data: any[] | null; error: any }>{
  if(!userId || !extractId || !chapter || !title || !author){
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
    .from('instalments')
    .insert({ userid: userId, extractid: extractId, chapter: chapter, title: title, author: author, subscriptionid: subscriptionId })
    .select();

    return { data, error };
}

export async function updateSubscription(subscriptionId: number, chapter: number) : Promise<{ data: SubscriptionType[] | null; error: any }>{
  if(!subscriptionId){
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({chapter: chapter, due: new Date().getTime() + 604800000}) // 7 days in milliseconds
    .eq('id', subscriptionId)
    .select();

    return { data, error };
}

export async function getAllInstalments(userId: string) : Promise<{ data: any[] | null; error: any }>{
  if(!userId){
    throw new Error("Missing required parameters");
  }

  const { data, error } = await supabase
    .from('instalments')
    .select()
    .match({ userid: userId })
    .select();

    return { data, error };
}