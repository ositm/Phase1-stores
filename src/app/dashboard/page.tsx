import { getUserProfile, getVendorStats } from "./actions";
import { VendorDashboard } from "@/components/dashboard/vendor-view";
import { BuyerDashboard } from "@/components/dashboard/buyer-view";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let profile = await getUserProfile();

    // Auto-Fix: If profile is missing but user exists, create it now.
    if (!profile) {
        const { data: newProfile, error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: user.user_metadata.full_name || "New User",
                is_vendor: false,
                avatar_url: user.user_metadata.avatar_url || "",
                phone: user.user_metadata.phone || "",
            })
            .select()
            .single();

        if (newProfile) {
            profile = newProfile;
        }
    }

    // If still no profile (DB error?), show a graceful error instead of infinite loading
    if (!profile) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">Account Setup Required</h2>
                <p className="text-muted-foreground">We couldn&apos;t load your profile. Please try refreshing.</p>
            </div>
        );
    }

    const stats = await getVendorStats();

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your {profile.is_vendor ? "store" : "account"} and activity.
                    </p>
                </div>
            </div>

            {profile.is_vendor ? (
                <VendorDashboard profile={profile} stats={stats} />
            ) : (
                <BuyerDashboard profile={profile} />
            )}
        </div>
    );
}
