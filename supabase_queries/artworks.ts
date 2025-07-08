import supabase from "../lib/supabase";

export async function saveUserArtwork(userId: string, title: string, artist: string, year: number, url: string){
    if (!userId || !title || !artist || !year) {
        throw new Error("Missing required parameters");
    }
    
    const { data, error } = await supabase
        .from("userartworks")
        .insert([{ userid: userId, title, artist, year, url }])
        .select()
        .single();
    
    if (error) {
        console.error("Error saving artwork:", error);
        return null;
    }
    
    return data;
}

export async function getUserArtworkById(id: string) {
    if (!id) {
        throw new Error("Missing required parameters");
    }
    
    const { data, error } = await supabase
        .from("userartworks")
        .select("*")
        .eq("id", id)
        .single();
    
    if (error) {
        console.error("Error fetching artwork by ID:", error);
        return null;
    }
    
    return data;
}

export async function checkUserArtworkExists(userId: string, title: string, artist: string, year: number) {
    if (!userId || !title) {
        throw new Error("Missing required parameters");
    }
    
    const { data } = await supabase
        .from("userartworks")
        .select("*")
        .eq("userid", userId)
        .eq("artist", artist)
        .eq("title", title)
        .eq("year", year)
        .single();
    
    return data;
}

export async function getUserArtworks(userId: string){
    if (!userId) {
        throw new Error("Missing userId parameter");
    }
    
    const { data, error } = await supabase
        .from("userartworks")
        .select("*")
        .eq("userid", userId)
    
    if (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }
    
    return data || [];
}

export async function deleteUserArtwork(userId: string, id: number) {
    if (!userId || !id) {
        throw new Error("Missing required parameters");
    }
    
    const { data, error } = await supabase
        .from("userartworks")
        .delete()
        .eq("userid", userId)
        .eq("id", id)
        .select()
        .single();
    
    if (error) {
        console.error("Error deleting artwork:", error);
        return null;
    }
    
    return data;
}

export async function postArtworkToFeed(userid: string, username: number, artist: string, title: string, url: string, year: number){
    if (!userid || !username || !artist || !title || !url || !year) {
        throw new Error("Missing required parameters");
    }
    
    const { data, error } = await supabase
        .from("publicartworks")
        .insert([{ userid, username, artist, title, url, year }])
        .select()
        .single();
    
    if (error) {
        console.error("Error posting artwork to feed:", error);
        return null;
    }

    const { error: updatedError } = await supabase
        .from("userartworks")
        .update({ posted: true })
        .eq("userid", userid)
        .eq("title", title)
        .eq("artist", artist)
        .eq("year", year)
        .select()
        .single();
    
    if(updatedError){
        console.error("Error updating user artwork after posting:", updatedError);
        return null;
    }
    
    return data;
}

export async function deleteArtworkFromFeed(userid: string, title: string, artist: string, year: number) {
    if (!userid || !title || !artist || !year) {
        throw new Error("Missing required parameters");
    }
    
    const { data, error } = await supabase
        .from("publicartworks")
        .delete()
        .eq("userid", userid)
        .eq("title", title)
        .eq("artist", artist)
        .eq("year", year)
        .select()
        .single();
    
    if (error) {
        console.error("Error deleting artwork from feed:", error);
        return null;
    }

      const { error: updatedError } = await supabase
        .from("userartworks")
        .update({ posted: false })
        .eq("userid", userid)
        .eq("title", title)
        .eq("artist", artist)
        .eq("year", year)
        .select()
        .single();

    if(updatedError){
        console.error("Error deleting artwork from feed:", error);
        return null;
    }

    return data;
}

export async function getPublicArtworks() {
    const { data, error } = await supabase
        .from("publicartworks")
        .select("*")
    
    if (error) {
        console.error("Error fetching public artworks:", error);
        return [];
    }
    
    return data || [];
}