import { auth } from "@/lib/auth";
import { db } from "@/db";
import { project, file } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const [foundProject] = await db.select()
            .from(project)
            .where(and(eq(project.id, id), eq(project.userId, session.user.id)));

        if (!foundProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const files = await db.select()
            .from(file)
            .where(eq(file.projectId, id));

        return NextResponse.json({ ...foundProject, files });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await db.delete(project)
            .where(and(eq(project.id, id), eq(project.userId, session.user.id)));

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
