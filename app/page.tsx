// Root route: redirects into the dashboard, the app's actual entry point.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
