
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";
    // Do not expose keys, just check existence
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "PRESENT" : "MISSING";

    return NextResponse.json({
        status: "ok",
        env: {
            supabaseUrl,
            supabaseAnonKey
        },
        message: "If you see this, the deployment logic is working."
    });
}
