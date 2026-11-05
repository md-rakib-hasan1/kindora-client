
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

  // Get the destination page after registration
  const getCallbackURL = () => {
    const params = new URLSearchParams(window.location.search);
    const callbackURL = params.get("callbackURL");

    if (
      callbackURL?.startsWith("/") &&
      !callbackURL.startsWith("//")
    ) {
      return callbackURL;
    }

    return "/";
  };

  // Register new user
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      password.length < 6
    ) {
      toast.error(
        "Password must contain uppercase, lowercase and at least 6 characters."
      );
      return;
    }

    setIsPending(true);

    const callbackURL = getCallbackURL();

    try {
      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        image: image.trim() || undefined,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // Navigate to login while preserving callback URL
  const handleLoginNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    const callbackURL = getCallbackURL();

    router.push(
      `/login?callbackURL=${encodeURIComponent(callbackURL)}`
    );
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">
            Join Kindora
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Create an account and start making a difference.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Profile Photo URL (Optional)
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Minimum 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            onClick={handleLoginNavigation}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
