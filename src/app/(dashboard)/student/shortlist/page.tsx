import { ShortlistList } from "@/components/features/shortlist/shortlist-list";
import { PageHeader } from "@/components/layout/public/page-header";

export default function StudentShortlistPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Shortlist"
        description="Opportunities you've saved for later. Select 2+ to compare."
      />
      <ShortlistList />
    </div>
  );
}