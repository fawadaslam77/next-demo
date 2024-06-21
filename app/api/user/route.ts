import { main } from "@/scripts/seed";
import { NextRequest, NextResponse } from "next/server";

// Api route will be /api/user
export async function GET() {
    console.log(process.env.NEXTAUTH_SECRET)
    const res = main();
    console.log(res)
    return NextResponse.json({ success: true, message: 'User fetched successfully.', data: [] }, { status: 200 })
}

// Api route will be /api/user
export async function POST(request: NextRequest) {

    const { user_name, email } = await request.json();
}