import { auth } from "@/lib/auth";
import { db } from "@/db";
import { project, file } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Verify ownership
        const [foundProject] = await db.select()
            .from(project)
            .where(and(eq(project.id, id), eq(project.userId, session.user.id)));

        if (!foundProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const body = await req.json();
        const { files } = body; // Array of file objects

        if (!Array.isArray(files)) {
            return NextResponse.json({ error: "Invalid files data" }, { status: 400 });
        }

        // Transactional update: Delete all existing files and re-insert (simplest sync strategy for now)
        // Optimization: Use upsert or diffing in future
        await db.transaction(async (tx) => {
            await tx.delete(file).where(eq(file.projectId, id));

            if (files.length > 0) {
                await tx.insert(file).values(files.map((f: any) => ({
                    id: f.id,
                    projectId: id,
                    name: f.name,
                    content: f.content || "",
                    type: f.type,
                    parentId: f.parentId || null
                })));
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to sync files" }, { status: 500 });
    }
}
