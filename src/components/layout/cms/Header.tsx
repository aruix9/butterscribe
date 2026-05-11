"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import Logo from "@/components/shared/logo";
import PrimaryNavigation from "./PrimaryNavigation";
import AuthLinks from "./AuthLinks";
import { Button } from "../../ui/button";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-primary/10">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center gap-4 lg:justify-between">
        <Button className="max-lg:block hidden p-0 !bg-transparent text-primary" onClick={() => setOpenMenu(!openMenu)}>
          <Menu className="size-6" absoluteStrokeWidth />
        </Button>
        <Logo className="max-lg:mr-auto" />
        <PrimaryNavigation openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <AuthLinks />
      </div>
    </nav>
  );
}

export default Header
