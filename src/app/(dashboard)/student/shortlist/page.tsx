import { PageHeader } from "@/components/layout/public/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShortlistPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="My Shortlist"
        description="Opportunities you're considering."
        action={
          <Link href="/student/shortlist/compare">
            <Button size="sm" variant="outline">
              Compare
            </Button>
          </Link>
        }
      />
      {/* TODO: GET /api/v1/shortlist */}
      {/* TODO: PATCH /api/v1/shortlist/:id */}
      {/* TODO: DELETE /api/v1/shortlist/:id */}
    </div>
  );
}