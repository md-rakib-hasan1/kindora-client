
"use client";

import { useState } from "react";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    // UI only — no actual subscription
    setEmail("");
  };

  return (
    <section className="bg-[#174C37] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#A5C96B]">
          <Mail size={26} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#A5C96B]">
          Stay Connected
        </p>

        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          A Little Good News Goes a Long Way.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
          Get updates about upcoming community events, inspiring stories,
          and new opportunities to make a difference.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="min-h-14 flex-1 rounded-full border border-white/20 bg-white px-6 text-sm text-[#253B32] outline-none placeholder:text-[#89948C] focus:ring-2 focus:ring-[#A5C96B]"
          />

          <button
            type="submit"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#A5C96B] px-7 text-sm font-bold text-[#253B32] transition-colors hover:bg-[#B9D98B]"
          >
            Subscribe
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-4 text-xs text-white/50">
          Be part of something good. No spam, just positive impact.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
