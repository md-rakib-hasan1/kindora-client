
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, User, ChevronDown, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
];

const Navbar = () => {
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const { data: session, isPending } = authClient.useSession();

    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setMounted(true), 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleLogout = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            toast.error(error.message || "Logout failed.");
            return;
        }

        setIsProfileOpen(false);
        toast.success("Logged out successfully!");
        router.push("/");
        router.refresh();
    };

    const user = session?.user;

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground">
                        🌿
                    </div>
                    <span className="font-heading text-2xl font-bold text-primary">
                        Kindora
                    </span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                    >
                        {mounted ? (
                            theme === "dark" ? (
                                <Sun size={19} />
                            ) : (
                                <Moon size={19} />
                            )
                        ) : (
                            <span className="h-[19px] w-[19px]" />
                        )}
                    </button>

                    {/* Authentication */}
                    {isPending ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 rounded-full border border-border p-1.5 pr-3 transition-colors hover:bg-muted"
                            >
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={32}
                                        height={32}
                                        unoptimized
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <User size={17} />
                                    </div>
                                )}

                                <ChevronDown size={16} className="text-foreground" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-60 rounded-xl border border-border bg-background p-2 shadow-xl">
                                    <div className="border-b border-border px-3 py-3">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="py-2">
                                        {[
                                            { label: "Create Event", href: "/create-event" },
                                            { label: "Manage Events", href: "/manage-events" },
                                            { label: "Joined Events", href: "/joined-events" },
                                        ].map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg border-t border-border px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-muted"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </nav>

            {/* Mobile Menu */}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-border bg-background px-5 py-5 md:hidden">
                    <div className="space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-sm font-medium text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="my-5 border-t border-border" />

                    {/* Mobile Theme Toggle */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                        {mounted ? (
                            theme === "dark" ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )
                        ) : (
                            <span className="h-[18px] w-[18px]" />
                        )}
                        {mounted
                            ? theme === "dark"
                                ? "Light Mode"
                                : "Dark Mode"
                            : "Theme"}
                    </button>

                    <div className="border-t border-border pt-5">
                        {isPending ? (
                            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                        ) : user ? (
                            <div className="space-y-4">
                                {/* Logged In Profile */}
                                <div className="flex items-center gap-3">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || "User"}
                                            width={44}
                                            height={44}
                                            unoptimized
                                            className="h-11 w-11 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <User size={20} />
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pl-2">
                                    {[
                                        { label: "Create Event", href: "/create-event" },
                                        { label: "Manage Events", href: "/manage-events" },
                                        { label: "Joined Events", href: "/joined-events" },
                                    ].map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-sm text-foreground hover:text-primary"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg border-t border-border pt-4 text-sm font-semibold text-destructive"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            /* Logged Out */
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 rounded-full border border-primary py-3 text-center text-sm font-semibold text-primary"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </header>
    );
};

export default Navbar;
