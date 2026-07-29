import { ProfileAdminClient } from "@/components/profiles/profile-admin-client";
import { getCatalogSettings } from "@/lib/catalog";
import { listProfiles } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function CredentialsProfilesAdminPage() {
  const [profiles, catalog] = await Promise.all([
    listProfiles(),
    getCatalogSettings(),
  ]);

  return (
    <ProfileAdminClient initialProfiles={profiles} initialCatalog={catalog} />
  );
}
