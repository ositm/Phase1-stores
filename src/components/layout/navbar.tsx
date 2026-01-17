import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

export async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl font-outfit text-primary">
                    <span>Phase 1</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/dashboard">
                            <Button variant="default" className="gap-2">
                                <User className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
