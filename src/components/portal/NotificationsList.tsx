import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationsListProps {
  notifications?: Notification[];
}

export function NotificationsList({
  notifications = [
    {
      id: "1",
      title: "Maintenance Request Update",
      message: "Your request #123 has been scheduled.",
      date: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Rent Reminder",
      message: "Rent is due in 3 days.",
      date: new Date(Date.now() - 86400000),
      read: true,
    },
  ],
}: NotificationsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg ${
                notif.read ? "bg-muted/50" : "bg-muted"
              }`}
            >
              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(notif.date, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}