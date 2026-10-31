
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
    { label: "Create Event", href: "/create-event" },
    { label: "About Us", href: "/#about" },
];

const Footer = () => {
    return (
        <footer className="bg-[#101D17] px-5 pt-16 pb-8 text-white lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A5C96B] text-xl">
                                🌿
                            </span>
                            <span className="font-heading text-2xl font-bold">
                                Kindora
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                            Small Acts. Stronger Communities. Join hands with people
                            who believe that meaningful change starts with small actions.
                        </p>


                        <div className="mt-6 flex gap-3">
                            {[
                                {
                                    label: "f",
                                    href: "https://facebook.com",
                                    name: "Facebook",
                                    color: "bg-[#1877F2]",
                                },
                                {
                                    label: "ig",
                                    href: "https://instagram.com",
                                    name: "Instagram",
                                    color:
                                        "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
                                },
                                {
                                    label: "in",
                                    href: "https://linkedin.com",
                                    name: "LinkedIn",
                                    color: "bg-[#0A66C2]",
                                },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white transition-transform hover:-translate-y-1 ${social.color}`}
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>



                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-5 font-semibold text-[#A5C96B]">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 transition-colors hover:text-[#A5C96B]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 font-semibold text-[#A5C96B]">
                            Get In Touch
                        </h3>

                        <p className="text-sm leading-7 text-white/60">
                            Have an idea or want to make a difference in your community?
                            We would love to hear from you.
                        </p>

                        <a
                            href="mailto:hello@kindora.com"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#A5C96B]"
                        >
                            hello@kindora.com
                            <ArrowUpRight size={15} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} Kindora. All rights reserved.
                    </p>

                    <p>Made with care for stronger communities.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
