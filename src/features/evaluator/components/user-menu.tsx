"use client"

import { authClient } from "@/lib/auth-client"
import { LogOut, User, Github } from "lucide-react"
import { useState } from "react"

export function UserMenu() {
    const { data: session } = authClient.useSession()

    // Simple custom Google Icon SVG
    const GoogleIcon = () => (
        <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.424 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.424 44.599 -10.174 45.799 L -6.714 42.339 C -8.804 40.389 -11.514 39.239 -14.754 39.239 C -19.424 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
        </svg>
    )

    const handleSignIn = async (provider: "github" | "google") => {
        await authClient.signIn.social({
            provider
        })
    }

    const handleSignOut = async () => {
        await authClient.signOut()
    }

    if (!session) {
        return (
            <div className="border-t border-[#27272a] p-3 space-y-2">
                <p className="text-[11px] text-[#71717a] font-medium px-1">Sign in to save projects</p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleSignIn("github")}
                        className="flex items-center justify-center gap-2 h-8 rounded bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] text-[11px] font-medium transition-colors"
                    >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                    </button>
                    <button
                        onClick={() => handleSignIn("google")}
                        className="flex items-center justify-center gap-2 h-8 rounded bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] text-[11px] font-medium transition-colors"
                    >
                        <GoogleIcon />
                        Google
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="border-t border-[#27272a] p-3">
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 overflow-hidden">
                    {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="w-6 h-6 rounded-full" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">{session.user.name?.charAt(0)}</span>
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-medium text-[#e4e4e7] truncate">{session.user.name}</span>
                        <span className="text-[10px] text-[#71717a] truncate">{session.user.email}</span>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded hover:bg-[#27272a] text-[#71717a] hover:text-[#ef4444] transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
