import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

const Restricted = () => {
    return (
        <div className="p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full mb-4">
                <ShieldAlert className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Access Restricted</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
                The Clients management module is exclusively restricted to Super User accounts. Contact your administrator if you need higher access privileges.
            </p>
            <Link href="/dashboard">
                <Button className="font-bold bg-primary text-white">Return to Dashboard</Button>
            </Link>
        </div>
    )
}

export default Restricted;