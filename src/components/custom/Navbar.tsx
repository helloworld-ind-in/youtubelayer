"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="mx-auto max-w-2xl my-2 px-4 py-2 shadow-2xl rounded-4xl border-slate-300 border-2 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">YouTubeLayer</Link>
        <div className="flex flex-row justify-center items-center space-x-2">
          {
            session ? (
              <>
                {
                  user?.role === "owner" ? (
                    <GoogleLoginButton />
                  ) : (
                    <></>
                  )
                }
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mr-4" align="start">
                    <DropdownMenuLabel>Role: {user?.role}</DropdownMenuLabel>
                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Keyboard shortcuts
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuItem disabled>API</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Signout
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button className="w-full md:w-auto">Signin</Button>
                </Link>
              </>
            )
          }
        </div>
      </div>
    </nav>
  )
}