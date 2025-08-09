import { File } from '@/app/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import cuid from 'cuid';

export async function POST(req: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({
                error: 'Unauthorized'
            }, { status: 401 })
        }

        const body = await req.json()
        const { name, userId: bodyUserId, parentId = null } = body;

        if (bodyUserId !== userId) {
            return NextResponse.json({
                error: 'Unauthorized'
            }, { status: 401 })
        }

        if (!name || typeof name !== 'string' || name.trim() === "") {
            return NextResponse.json({
                error: 'Folder name is required'
            }, { status: 400 })
        }

        if (parentId) {
            const parentFolder = await prisma.file.findFirst({
                where: {
                    id: parentId,
                    userId: userId,
                    isFolder: true
                }
            })

            if (!parentFolder) {
                return NextResponse.json({
                    error: 'Parent Folder Not Found'
                }, { status: 401 })
            }
        }

        // create folder
        const folderData = {
            id: cuid(),
            name: name.trim(),
            path: `/folders/${userId}/${cuid()}`,
            size: 0,
            type: 'folder',
            fileUrl: '',
            thumbnailUrl: '',
            userId: userId,
            parentId: parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false
        }

        const newFolder = await prisma.file.create({
            data: folderData
        })

        return NextResponse.json({
            success: true,
            message: "Folder Created Successfully",
            folder: newFolder
        })

    } catch (err) {


    }
}