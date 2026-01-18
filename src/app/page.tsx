import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "@/components/marketplace/search-bar";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/animations";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const supabase = await createClient();
  const params = await searchParams; // Wait for params if needed in Next 15, valid in 14.

  let query = supabase
    .from("products")
    .select("*, vendor:profiles(full_name, business_name, is_vendor)")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.ilike("title", `%${params.q}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  const { data: products } = await query;

  const categories = [
    "Fashion", "Beauty", "Food", "Electronics", "Home", "Services", "Other"
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-20 px-4 md:px-6 text-center text-primary-foreground relative overflow-hidden">
        {/* Simple noise texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>

        <FadeIn>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-outfit mb-4 relative z-10">
            Phase 1
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto relative z-10">
            Discover the best vendors in Nigeria. Chat directly on WhatsApp or Instagram.
          </p>
          <div className="flex justify-center w-full relative z-10">
            <SearchBar />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 relative z-10">
            <span className="text-sm opacity-80">Popular:</span>
            {categories.slice(0, 4).map(cat => (
              <Link key={cat} href={`/?category=${cat.toLowerCase()}`}>
                <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full">
                  {cat}
                </Button>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Main Content */}
      <main className="flex-1 container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {params.q ? `Results for "${params.q}"` : params.category ? `${params.category} Products` : "Latest Products"}
          </h2>
          {(params.q || params.category) && (
            <Link href="/">
              <Button variant="ghost" size="sm">Clear Filters</Button>
            </Link>
          )}
        </div>

        {products && products.length > 0 ? (
          <StaggerContainer className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <StaggerItem key={product.id}>
                {/* @ts-expect-error Product type definition mismatch in map */}
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found.</p>
          </div>
        )}
      </main>

      <footer className="bg-muted py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Phase 1 Nigeria.</p>
      </footer>
    </div>
  );
}
