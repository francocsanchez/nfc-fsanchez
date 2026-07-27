import { RemindersDashboardClient } from "@/components/reminders/reminders-dashboard-client";
import { requireSession } from "@/lib/auth-session";
import { getPushPublicKey, isPushConfigured } from "@/lib/push";
import { listRemindersByUser } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export default async function RemindersAppPage() {
  const session = await requireSession("/recordatorios/app");
  const reminders = await listRemindersByUser(session.user.id);

  return (
    <RemindersDashboardClient
      initialReminders={reminders}
      userName={session.user.name || session.user.email}
      pushPublicKey={getPushPublicKey()}
      pushConfigured={isPushConfigured()}
    />
  );
}
