import { NextRequest, NextResponse } from "next/server";

// Api route will be /api/user/projects :: Get all user projects
export async function GET() {
    return NextResponse.json({ success: true, message: 'Jobs fetched successfully.', data: [] }, { status: 200 })
}

// Api route will be /api/user/projects :: Add new user project
export async function POST(request: NextRequest) {

    const { job_title, description } = await request.json();
}

// Api route will be /api/user/projects Update user project ?
export async function PUT(request: NextRequest) {

    const body = await request.json();
}