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
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  return data;
}

export async function resetPassword(email){
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:8081/changepassword',
  })
}

export async function updatePassword(password){
  await supabase.auth.updateUser({ password: password })
}