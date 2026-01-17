import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import { redirect } from "next/navigation";
import { ProductActions } from "@/components/dashboard/product-actions";

export default async function ProductsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                <Link href="/dashboard/products/add">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {products && products.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            {product.image_url && (
                                <div className="aspect-square w-full relative bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg truncate">{product.title}</CardTitle>
                                <p className="text-sm font-medium text-primary">₦{product.price.toLocaleString()}</p>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                            </CardContent>
                            <ProductActions id={product.id} />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        Start building your catalog by adding your first product.
                    </p>
                    <Link href="/dashboard/products/add" className="mt-6">
                        <Button>Add Product</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
