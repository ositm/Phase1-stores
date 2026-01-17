import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Instagram } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params; // Next 15 awaits params

    const { data: product } = await supabase
        .from("products")
        .select("*, vendor:profiles(*)")
        .eq("id", id)
        .single();

    if (!product) {
        notFound();
    }

    const vendor = product.vendor;
    const whatsappLink = vendor.phone
        ? `https://wa.me/${vendor.phone.replace(/\+/g, "").replace(/\s/g, "")}?text=Hi, I saw your product "${product.title}" on Phase 1.`
        : null;

    const instagramLink = vendor.instagram_username
        ? `https://instagram.com/${vendor.instagram_username.replace("@", "")}`
        : null;

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Marketplace
                    </Link>
                </div>
            </header>

            <main className="container py-8 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden border">
                        {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Badge className="mb-2">{product.category}</Badge>
                            <h1 className="text-3xl font-bold tracking-tight font-outfit">{product.title}</h1>
                            <p className="text-2xl font-bold text-primary mt-2">₦{product.price.toLocaleString()}</p>
                        </div>

                        <Card className="bg-muted/30">
                            <CardContent className="p-4 space-y-2">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Description</h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {product.description || "No description provided."}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="border-t pt-6">
                            <h3 className="text-sm font-medium mb-3">Seller Information</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {vendor.business_name?.[0] || vendor.full_name?.[0] || "V"}
                                </div>
                                <div>
                                    <p className="font-medium text-lg leading-none">{vendor.business_name || vendor.full_name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Verified Vendor</p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {whatsappLink && (
                                    <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold h-12">
                                            <MessageCircle className="h-5 w-5" />
                                            Chat on WhatsApp
                                        </Button>
                                    </Link>
                                )}
                                {instagramLink && (
                                    <Link href={instagramLink} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full gap-2 font-medium h-12">
                                            <Instagram className="h-5 w-5" />
                                            View on Instagram
                                        </Button>
                                    </Link>
                                )}
                                {!whatsappLink && !instagramLink && (
                                    <p className="text-sm text-destructive">No contact information available for this vendor.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
