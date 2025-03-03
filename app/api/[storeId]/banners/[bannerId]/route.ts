import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { bannerId: string } }
){
    try {

        if(!params.bannerId){
            return new NextResponse("Id banner tidak ditemukan", { status: 400 });
        }

        const banner = await db.banner.findUnique({
            where: {
                id: params.bannerId,
            }
        });

        return NextResponse.json(banner);
    } catch (error) {
        console.log('[BANNER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, bannerId: string } }
){
    try {

        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!label){
            return new NextResponse("Harus mengisi label", { status: 400 });
        }

        if(!imageUrl){
            return new NextResponse("Harus mengisi imageUrl", { status: 400 });
        }

        if(!params.bannerId){
            return new NextResponse("Id banner tidak ditemukan", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const banner = await db.banner.updateMany({
            where: {
                id: params.bannerId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log('[BANNER_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, bannerId: string } }
){
    try {

        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.bannerId){
            return new NextResponse("Id banner tidak ditemukan", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const banner = await db.banner.deleteMany({
            where: {
                id: params.bannerId,
            }
        });

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log('[BANNER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}