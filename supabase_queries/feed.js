import supabase from '../lib/supabase';

export async function getExtracts(){
    const { data, error } = await supabase
        .from('extracts')
        .select('*')
        .eq('chapter', 1)
    
    return { data, error };
}