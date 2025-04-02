import supabase from '../lib/supabase';


export async function getUserSession(){
  const { data: { user } } = await supabase.auth.getUser()

  return user;
}

export async function createNewProfile(user_id, created_at){
const { data, error } = await supabase
  .from('profiles')
  .insert([
    { user_id: user_id, created_at: created_at },
  ])
  .select()
   return { data, error }
}

export async function lookUpUserProfile(user_id){
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if(error){
    console.error("Error finding profile:", error.message);
    return null;
  }
  return data;
}