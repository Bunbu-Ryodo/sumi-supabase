import supabase from '../lib/supabase';

export async function getUserSession(){
  const { data: { user } } = await supabase.auth.getUser()
  return user;
}

export async function createNewProfile(user_id, created_at){
const { data: userProfile, error } = await supabase
  .from('profiles')
  .insert([
    { user_id: user_id, created_at: created_at },
  ])
  .select()

  if(error){
    console.error('Error creating new profile:', error.message);
    return null;
  }
  return userProfile;
}

export async function lookUpUserProfile(user_id){
  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if(error){
    console.error('Error fetching user profile:', error.message);
    return null;
  }

  return userProfile;
}

//setLastLogin

export async function setLoginDateTime(user_id, lastLogin){

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ lastLogin: lastLogin })
      .eq('user_id', user_id)
      .select();

    if(updateError){
      console.error('Error updating last login:', updateError.message);
      return null;
    }
    return data;
}

export async function addTonsOfCredits(user_id, amount){

  const { data, error: updateError } = await supabase
    .from('profiles')
    .update({ ai_credits: amount })
    .eq('user_id', user_id)
    .select();

  if(updateError){
    console.error('Error updating AI credits:', updateError.message);
    return null;
  }

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