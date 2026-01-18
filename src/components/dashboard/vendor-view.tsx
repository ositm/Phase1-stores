import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VendorDashboard({ profile, stats }: { profile: any, stats: any }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            Active listings
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground border-none">
                    <CardHeader>
                        <CardTitle>Welcome back, {profile.business_name || profile.full_name}</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Manage your store and products here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/products/add">
                            <Button variant="secondary" className="gap-2">
                                <Plus className="h-4 w-4" /> Add New Product
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Link href="/dashboard/products">
                            <Button variant="outline" className="w-full justify-start">
                                Manage Products
                            </Button>
                        </Link>
                        <Link href="/dashboard/profile">
                            <Button variant="outline" className="w-full justify-start">
                                Edit Store Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
