import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      <p className="eyebrow mb-2">Sign in</p>
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Sign in to bookmark resources, join discussions, and track your progress.
      </p>

      <div className="mt-8 w-full space-y-3">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button type="submit" variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button type="submit" variant="secondary" className="w-full">
            Continue with GitHub
          </Button>
        </form>
        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("nodemailer", { email: formData.get("email") });
          }}
          className="flex gap-2"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-base-border bg-base-panel px-3 py-2 text-sm focus:border-cyan/50 focus:outline-none"
          />
          <Button type="submit">Send link</Button>
        </form>
      </div>
    </div>
  );
}
