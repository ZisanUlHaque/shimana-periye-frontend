import { PageHeader } from "@/components/layout/public/page-header";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile Information"
        description="Target degree, bio, research interests & skills."
      />
      {/* TODO: GET /api/v1/student-profile/me */}
      {/* TODO: PATCH /api/v1/student-profile/me */}
      {/* TODO: GET /api/v1/student-profile/me/completeness */}
    </div>
  );
}