import { ProfileAdminClient } from "@/components/profiles/profile-admin-client";
import { listProfiles } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  const profiles = await listProfiles();

  return <ProfileAdminClient initialProfiles={profiles} />;
}
