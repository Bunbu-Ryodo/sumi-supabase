export async function getExtract(extractId){
    const { data, error } = await supabase
        .from('extracts')
        .select('*')
        .eq('id', extractId)
        .single();

    return { data, error };
}