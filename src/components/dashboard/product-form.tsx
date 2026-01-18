"use client";

import { useState } from "react";
import { addProduct } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlus, Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductForm({ product }: { product?: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(product?.image_url || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);

        try {
            if (product) {
                // For update, we might need to append ID if it's not in the form as hidden input
                formData.append("id", product.id);
                // Call update action
                // Dynamically importing to avoid circular dep issues if any, or just import at top
                const { updateProduct } = await import("@/app/dashboard/actions");
                await updateProduct(formData);
            } else {
                await addProduct(formData);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Product Name</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                            placeholder="e.g. Handmade Ankra Bag"
                            defaultValue={product?.title}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₦)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                placeholder="5000"
                                defaultValue={product?.price}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                                defaultValue={product?.category || ""}
                            >
                                <option value="">Select Category</option>
                                <option value="fashion">Fashion & Clothing</option>
                                <option value="beauty">Beauty & Skincare</option>
                                <option value="food">Food & Drinks</option>
                                <option value="electronics">Electronics</option>
                                <option value="home">Home & Living</option>
                                <option value="services">Services</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your product..."
                            rows={4}
                            defaultValue={product?.description}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Product Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted overflow-hidden">
                                {preview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <ImagePlus className="h-8 w-8 opacity-50" />
                                )}
                            </div>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="w-full max-w-sm"
                                onChange={handleImageChange}
                                required={!product?.image_url} // Required only if no existing image
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {product ? "Update Product" : "Create Product"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
