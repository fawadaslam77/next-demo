import { NextRequest } from "next/server";

// Api route will be /api/jobs?slug=eng-to-urdu  :: To get jobs based on slug  
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {

}