import { ReactNode } from "react";
import Link from "next/link";

const tabs = [
  { title: "Profile Info", href: "/student/profile" },
  { title: "Academic Records", href: "/student/profile/academic-records" },
  { title: "Experience", href: "/student/profile/experiences" },
  { title: "Publications", href: "/student/profile/publications" },
  { title: "Test Scores", href: "/student/profile/test-records" },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <nav className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            {tab.title}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}