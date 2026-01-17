import { getUserProfile, updateProfile } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default async function ProfilePage() {
    const profile = await getUserProfile();

    if (!profile) return null;

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                    Manage your public profile and contact information.
                </CardDescription>
            </CardHeader>
            <form action={updateProfile}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile.email} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            defaultValue={profile.full_name || ""}
                            required
                        />
                    </div>
                    {profile.is_vendor && (
                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                                id="businessName"
                                name="businessName"
                                defaultValue={profile.business_name || ""}
                                placeholder="My Business Ltd"
                                required
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="phone">WhatsApp Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={profile.phone || ""}
                            placeholder="+234..."
                            required
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Include country code (e.g., +234) for WhatsApp links to work.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Username</Label>
                        <Input
                            id="instagram"
                            name="instagram"
                            defaultValue={profile.instagram_username || ""}
                            placeholder="username_only"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Save Changes</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
