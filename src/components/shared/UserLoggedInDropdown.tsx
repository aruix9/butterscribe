import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

const UserLoggedInDropdown = ({ user }: { user: any }) => {
    const userName = user?.name;
    const nameParts = userName?.split(" ");
    const initials = nameParts
        ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
        : "";
    const role = user.role || 'user';

    const getRoleBadge = (roleName: string) => {
        const formattedRole = roleName.toLowerCase();
        let userRole = '';
        switch (formattedRole) {
            case 'super user':
                userRole = 'Super User';
                break;
            case 'admin':
                userRole = 'Admin';
                break;
            case 'manager':
                userRole = 'Manager';
                break;
            default:
                userRole = 'User';
                break;
        }

        return userRole;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex items-center">
                <Button className="!p-0 !bg-transparent h-auto cursor-pointer text-slate-400">
                    <div className="max-sm:hidden w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                        {initials}
                    </div>
                    <div className="max-sm:hidden text-left">
                        <p className="text-xs font-bold text-slate-500">{userName}</p>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {getRoleBadge(role)}
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
        </DropdownMenu >
    )
}

export default UserLoggedInDropdown