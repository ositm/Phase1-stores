import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { becomeVendor } from "@/app/dashboard/actions";

export function BuyerDashboard({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Account Status
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Buyer</div>
                        <p className="text-xs text-muted-foreground">
                            Standard account
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Buying</CardTitle>
                        <CardDescription>Manage your activity</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Link href="/">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <ShoppingBag className="h-4 w-4" /> Browse Marketplace
                            </Button>
                        </Link>
                        <Link href="/dashboard/profile">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <User className="h-4 w-4" /> Edit Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Become a Vendor</CardTitle>
                        <CardDescription>
                            Ready to start selling? Upgrade your account to open a store.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={becomeVendor}>
                            <Button className="w-full">Activate Vendor Account</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
