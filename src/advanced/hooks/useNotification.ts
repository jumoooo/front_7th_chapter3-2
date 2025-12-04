import { useState, useCallback } from "react";
import { Notification } from "../domain/notification/notificationTypes";

/**
 * 알림 관련 상태 및 로직을 관리하는 Hook
 * 
 * Entity를 다루지 않는 UI 상태 Hook
 * - 알림은 비즈니스 엔티티가 아닌 UI 피드백
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return {
    notifications,
    setNotifications,
    addNotification,
  };
};

