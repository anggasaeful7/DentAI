"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function UserNav() {
    const { data: session } = useSession();

    if (session?.user) {
        return (
            <div className="flex items-center gap-2">
                {session.user.image ? (
                    <img
                        src={session.user.image}
                        alt=""
                        className="w-7 h-7 rounded-full border border-slate-600"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                        {session.user.name?.[0] || "U"}
                    </div>
                )}
                <button
                    onClick={() => signOut()}
                    className="px-2 py-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("google")}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
        >
            Login
        </button>
    );
}
