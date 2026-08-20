import { ProfileAdminClient } from "@/components/profiles/profile-admin-client";
import { getCatalogSettings } from "@/lib/catalog";
import { getProfileGlobalSettings } from "@/lib/profile-global-settings";
import { listProfiles } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function CredentialsProfilesAdminPage() {
  const [profiles, catalog, globalSettings] = await Promise.all([
    listProfiles(),
    getCatalogSettings(),
    getProfileGlobalSettings(),
  ]);

  return (
    <ProfileAdminClient
      initialProfiles={profiles}
      initialCatalog={catalog}
      initialGlobalSettings={globalSettings}
    />
  );
}
