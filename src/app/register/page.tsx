
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6) {
      toast.error("Password must contain uppercase, lowercase and at least 6 characters.");
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image.trim() || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F6F5EB] px-5 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-[#174C37]">
            Join Kindora
          </h1>
          <p className="mt-2 text-sm text-[#68776D]">
            Create an account and start making a difference.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#253B32]">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-[#DCE2D7] px-4 py-3 text-sm outline-none focus:border-[#174C37]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#253B32]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-[#DCE2D7] px-4 py-3 text-sm outline-none focus:border-[#174C37]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#253B32]">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-[#DCE2D7] px-4 py-3 text-sm outline-none focus:border-[#174C37]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#253B32]">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-lg border border-[#DCE2D7] px-4 py-3 text-sm outline-none focus:border-[#174C37]"
            />
            <p className="mt-2 text-xs text-[#68776D]">
              Minimum 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[#174C37] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#253B32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68776D]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#174C37] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
