import { Notification } from "../../domain/notification/notificationTypes";
import { NotificationItem } from "./NotificationItem";

interface NotificationProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const Notifications = ({
  notifications,
  setNotifications,
}: NotificationProps) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notif={notif}
          setNotifications={setNotifications}
        />
      ))}
    </div>
  );
};
