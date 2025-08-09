import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server"

export async function GET() {   
    try {
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
        })

        return Response.json({
            authenticationParameters,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
        })

    } catch (err) {
        return NextResponse.json({
            error: 'Authentication For Imagekit failed'
        } , {status: 500})
    }
}