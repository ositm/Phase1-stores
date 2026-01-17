"use client";

import { deleteProduct } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export function ProductActions({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex gap-2 p-4 pt-0">
            <Link href={`/dashboard/products/edit/${id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2">
                    <Edit className="h-4 w-4" /> Edit
                </Button>
            </Link>
            <form
                action={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                        startTransition(async () => {
                            const formData = new FormData();
                            formData.append("id", id);
                            await deleteProduct(formData);
                        });
                    }
                }}
            >
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    disabled={isPending}
                    type="submit"
                >
                    <Trash2 className="h-4 w-4" />
                    {isPending ? "..." : "Delete"}
                </Button>
            </form>
        </div>
    );
}
