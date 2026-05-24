"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { data } from "../../../../data";

const AuthLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // user
  const user = session?.user;
  const userName = user?.name;
  const nameParts = userName?.split(" ");
  const initials = nameParts
    ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
    : "";

  return (
    <>
      {session ? (
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex items-center">
              <Button className="!p-0 !bg-transparent h-auto cursor-pointer text-slate-400">
                <div className="max-sm:hidden w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                  {initials}
                </div>
                <div className="max-sm:hidden text-left">
                  <p className="text-xs font-bold text-slate-500">{userName}</p>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Upgrade
                  </span>
                </div>
                <UserRound className="size-7 sm:hidden" absoluteStrokeWidth />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel
                  onClick={() => signOut()}
                  className="cursor-pointer"
                >
                  Sign Out
                </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : pathname.includes("/signin") ? '' : (
        <Button>
          <Link href={data.signin.slug} passHref>
            {data.signin.title}
          </Link>
        </Button>
      )}
    </>
  );
};

export default AuthLinks;
