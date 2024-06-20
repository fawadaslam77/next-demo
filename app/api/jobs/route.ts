import { NextRequest, NextResponse } from "next/server";

// Api route will be /api/jobs
export async function GET() {
    return NextResponse.json({ success: true, message: 'Jobs fetched successfully.', data: [] }, { status: 200 })
}

// Api route will be /api/jobs
export async function POST(request: NextRequest) {

    const { job_title, description } = await request.json();
}