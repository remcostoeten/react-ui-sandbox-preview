import { auth } from "@/lib/auth";
import { db } from "@/db";
import { project, file } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projects = await db.select()
            .from(project)
            .where(eq(project.userId, session.user.id))
            .orderBy(desc(project.updatedAt));

        return NextResponse.json(projects);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, description } = body;

        const [newProject] = await db.insert(project).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            name: name || "Untitled Project",
            description,
        }).returning();

        // Create a default file for the new project
        await db.insert(file).values({
            id: crypto.randomUUID(),
            projectId: newProject.id,
            name: "App.tsx",
            content: "// Start coding!",
            type: "file",
        });

        return NextResponse.json(newProject);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
