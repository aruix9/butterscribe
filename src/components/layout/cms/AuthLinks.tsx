"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { data } from "../../../../data";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import UserLoggedInDropdown from "@/components/shared/UserLoggedInDropdown";

const AuthLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  return (
    <>
      {session ? (
        <div className="flex items-center gap-6">
          <UserLoggedInDropdown user={user} />
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
