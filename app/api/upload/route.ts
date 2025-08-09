import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({
                error: "UnAuthorized"
            }, { status: 401 })
        }

        const body = await req.json();
        const { imagekit, userId: bodyUserId } = body;

        if (bodyUserId !== userId) {
            return NextResponse.json({
                error: "UnAuthorized"
            }, { status: 401 })
        }

        if (!imagekit || !imagekit.url) {
            return NextResponse.json({
                error: "Invalid File Upload Data"
            }, { status: 401 })
        }

        const fileData= {
            name: imagekit.name || 'Untitlted',
            path: imagekit.filePath,
            size: imagekit.size || 0,
            type: imagekit.fileType || 'image',
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null,
            isFolder: false,
            isStarred: false,
            isTrash: false
        }

        const newFile = await prisma.file.create({
            data: fileData
        })

        return NextResponse.json({
            newFile
        })

    } catch (err) {
        return NextResponse.json({
            error: 'Failed to save info to DB'
        }  , {status: 500})
    }
}
