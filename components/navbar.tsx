"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import { User } from 'next-auth';
import { Menu, X } from 'lucide-react';

// COMPONENTS
import { Button } from './ui/button';

export const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-4 z-50 w-full px-4 md:px-6">
            <div className="container mx-auto bg-background/60 backdrop-blur-md border rounded-2xl shadow-sm transition-all overflow-hidden">
                <div className="px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Brand */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Feedback
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {session ? (
                                <>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Welcome, <span className="text-foreground font-semibold">{user.username || user.email}</span>
                                    </span>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in">
                                    <Button size="sm" className="font-semibold shadow-sm">
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="flex md:hidden items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden px-4 py-4 border-t animate-in slide-in-from-top-4 duration-200">
                        <div className="flex flex-col gap-4">
                            {session ? (
                                <>
                                    <div className="px-2">
                                        <p className="text-sm text-muted-foreground">Signed in as</p>
                                        <p className="text-sm font-semibold">{user.username || user.email}</p>
                                    </div>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="destructive"
                                        className="w-full justify-start"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full">
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
