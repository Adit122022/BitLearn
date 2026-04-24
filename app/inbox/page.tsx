import { getMyNotifications } from "@/app/actions/notification-actions"
import { InboxClient } from "./_components/InboxClient"

export default async function InboxPage() {
  const notifications = await getMyNotifications()
  return <InboxClient notifications={notifications as any} />
}
