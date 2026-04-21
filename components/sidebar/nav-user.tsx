"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { HomeIcon, Tv2Icon } from "lucide-react"
import { IconDashboard, IconDotsVertical, IconLogout } from "@tabler/icons-react"
import { useSignout } from "@/hooks/use-signout"

// we have to display this component in two places so we are making it reusable
const UserDisplay = ({ avatarUrl, username, user }: { avatarUrl: string, username: string, user: { name: string, email: string } }) => {
  return <>
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={avatarUrl} alt={username} />
      <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user?.name}</span>
      <span className="truncate text-xs text-muted-foreground">
        {user?.email}
      </span>
    </div></>
}

const userMenu = [
  {
    label: "HomePage",
    icon: HomeIcon,
    href: "/admin/account"
  },
  {
    label: "Dashboard",
    icon: IconDashboard,
    href: "/admin"
  },
  {
    label: "Courses",
    icon: Tv2Icon,
    href: "/admin/courses"
  },
]
export function NavUser() {
  const { isMobile } = useSidebar();

  const { handleSignout } = useSignout()

  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  const user = session?.user;
  if (!user) return null;
  //situation : sometimes better auth gives name:null in signup with github so we have to maintain that situation too
  const username = user?.name && user?.name.length > 0 ? user?.name.charAt(0).toUpperCase() : user?.email.slice(0, 2).toUpperCase();
  // situation : if user?.image is null then we have to generate avatar from username
  const avatarUrl = user?.image ?? `https://avatar.vercel.sh/${user?.email.split("@")[0]}.svg?text=${username}&size=100`;



  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserDisplay avatarUrl={avatarUrl} username={username} user={user} />

              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserDisplay avatarUrl={avatarUrl} username={username} user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>

              {userMenu.map((item) => {
                return (
                  <DropdownMenuItem asChild key={item.label} >
                    <Link href={item.href}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
