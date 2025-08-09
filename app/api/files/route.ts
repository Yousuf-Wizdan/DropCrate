import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({
                error: 'Unauthorized'
            }, { status: 401 })
        }

        const searchParams = req.nextUrl.searchParams;
        const queryUserId = searchParams.get('userId')
        const parentId = searchParams.get('parentId')

        if (!queryUserId || queryUserId !== userId) {
            return NextResponse.json({
                error: 'Unauthorized'
            }, { status: 401 })
        }

        let userFiles;
        if (parentId) {

            userFiles = await prisma.file.findMany({
                where: {
                    userId: userId,
                    parentId: parentId,
                }
            })

        } else {

            userFiles = await prisma.file.findMany({
                where: {
                    userId: userId,
                    parentId: null
                }
            })

        }

        return NextResponse.json(userFiles)

    } catch (err) {
        console.error("Error Error fetching files:", err);
        return NextResponse.json(
            { error: "Failed to fetch files" },
            { status: 500 }
        );

    }
}