import { ProductForm } from "@/components/dashboard/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
    return (
        <div className="max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                    <p className="text-muted-foreground">Fill in the details to list your item.</p>
                </div>
            </div>
            <ProductForm />
        </div>
    )
}
