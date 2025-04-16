export async function updateSubscription(userId, textId, chapter, date){
    if (!userId || !textId || !chapter || !date) {
        throw new Error("Missing required parameters");
    }

    const { data } = await supabase.from('subscriptions').select('*').eq('userid', userId).eq('textid', textId).single();

    if(data){
        const response = await supabase.from('subscriptions').delete().eq('userid', userId).eq('textid', textId).select();
        return response;
    } else {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert({ userid: userId, textid: textId, chapter: chapter, due: date })

        return { data, error }
    }
}