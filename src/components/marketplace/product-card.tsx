import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    product: {
        id: string;
        title: string;
        price: number;
        image_url?: string | null;
        category: string;
        vendor?: {
            business_name: string;
            full_name: string;
        };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-muted">
                <div className="aspect-square relative bg-muted">
                    {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-white/90 text-black hover:bg-white/90 backdrop-blur-sm">
                        {product.category}
                    </Badge>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                    <p className="text-primary font-bold mt-1">₦{product.price.toLocaleString()}</p>
                    {product.vendor && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                            Sold by {product.vendor.business_name || product.vendor.full_name}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
