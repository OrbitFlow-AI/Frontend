// Global 404 page shown for any unmatched route.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold text-slate-100">Page not found</h1>
      <p className="max-w-md text-sm text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/dashboard" className="text-sm text-primary hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
