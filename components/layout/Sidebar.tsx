// Primary left-hand navigation shown on every dashboard route.
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/marketplace", label: "Marketplace" },
  { href: "/dashboard/ledger", label: "Ledger" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-surface/60 p-4 md:block">
      <div className="mb-6 px-2">
        <span className="text-lg font-bold text-slate-100">OrbitFlow</span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
