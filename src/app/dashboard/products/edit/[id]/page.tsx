import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../../../../../components/dashboard/product-form";
import { notFound, redirect } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .eq("vendor_id", user.id)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
                <p className="text-muted-foreground">
                    Update your product details.
                </p>
            </div>

            <ProductForm product={product} />
        </div>
    );
}
