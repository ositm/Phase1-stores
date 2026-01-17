"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserProfile() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const updates = {
        id: user.id, // ID is required for upsert
        full_name: formData.get("fullName") as string,
        business_name: formData.get("businessName") as string,
        phone: formData.get("phone") as string,
        instagram_username: formData.get("instagram") as string,
    };

    const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: 'id' });

    if (error) {
        throw new Error("Could not update profile");
    }

    revalidatePath("/dashboard/profile");
}

export async function becomeVendor() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Profile guaranteed to exist by dashboard page
    // Constraint Check: vendors MUST have a business_name.
    // We generate a temporary unique one to satisfy the constraint, then redirect user to change it.
    const tempBusinessName = `${user.user_metadata.full_name || 'Vendor'}'s Shop ${Math.floor(Math.random() * 10000)}`;

    const { error } = await supabase.from("profiles")
        .update({
            is_vendor: true,
            business_name: tempBusinessName
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error becoming vendor:", error);
        throw new Error(`Could not upgrade account: ${error.message}`);
    }

    revalidatePath("/dashboard");
    redirect("/dashboard/profile");
}

export async function addProduct(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return; // Should redirect or throw

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;

        // Upload image
        const { error: uploadError, data } = await supabase.storage
            .from("products")
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error("Upload error", uploadError);
            throw new Error("Failed to upload image");
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        imageUrl = publicUrl;
    }

    // SELF-HEALING: Check if profile exists; if not, create it
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single();

    if (!profile) {
        console.log("Profile missing for user, creating now...");

        // Define profile data
        const profileData = {
            id: user.id,
            is_vendor: true,
            full_name: user.user_metadata.full_name || "Vendor",
            phone: user.user_metadata.phone || "",
            avatar_url: user.user_metadata.avatar_url || ""
        };

        const { error: profileError } = await supabase.from("profiles").upsert(profileData, { onConflict: 'id' });

        if (profileError) {
            console.error("Failed to auto-create profile:", profileError);
            throw new Error(`Failed to create user profile: ${profileError.message}`);
        }
    }

    const { error } = await supabase.from("products").insert({
        vendor_id: user.id,
        title,
        description,
        price,
        category,
        image_url: imageUrl,
    });

    if (error) {
        console.error("Insert error", error);
        throw new Error(`Failed to create product: ${error.message} (${error.details})`);
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const id = formData.get("id") as string;

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("vendor_id", user.id);

    if (error) {
        throw new Error("Could not delete product");
    }

    revalidatePath("/dashboard/products");
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    const updates: any = {
        title,
        description,
        price,
        category,
    };

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, imageFile);

        if (uploadError) {
            throw new Error("Failed to upload image");
        }

        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        updates.image_url = publicUrl;
    }

    const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .eq("vendor_id", user.id);

    if (error) {
        throw new Error("Failed to update product");
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}

export async function getVendorStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { totalProducts: 0 };

    const { count } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .eq("vendor_id", user.id);

    return {
        totalProducts: count || 0
    };
}
