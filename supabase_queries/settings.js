export async function updatePassword(password){
    const { data, error } = await supabase.auth.updateUser({ password: password })
    return { data, error } 
}

export async function updateEmail(email){
    const { data, error } = await supabase.auth.updateUser({ email: email })
    return { data, error } 
}

export async function updateUsername(username){
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

    if (selectError) {
        console.error('Error fetching profile:', selectError.message);
        return { data: null, error: selectError };
    }

    if (profile) {
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ username: username })
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Error updating profile:', updateError.message);
            return { data: null, error: updateError };
        }

        return { data: updatedProfile, error: null }; 
    } else {
        console.log('No profile found for this user.');
        return { data: null, error: 'No profile found for this user.' };
    }
}

export async function getUsername(){
    const { data: { user } } = await supabase.auth.getUser();

     const { data } = await supabase
       .from('profiles')
       .select('*')
       .eq('user_id', user.id)
       .single();

     return data.username;
}