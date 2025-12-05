import { create } from "zustand";
import { Notification } from "../domain/notification/notificationTypes";

/**
 * 알림 관련 전역 상태를 관리하는 Zustand Store
 * 
 * Entity를 다루지 않는 UI 상태 Store
 * - 알림은 비즈니스 엔티티가 아닌 UI 피드백
 * - 의존성이 없어 가장 먼저 구현
 */
interface NotificationState {
  // 상태
  notifications: Notification[];

  // 액션
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  // 초기 상태
  notifications: [],

  // 알림 추가 (3초 후 자동 제거)
  addNotification: (message, type = "success") => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // 3초 후 자동 제거
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  // 알림 제거
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // 알림 목록 설정 (외부에서 직접 제어할 때 사용)
  setNotifications: (notifications) => {
    set({ notifications });
  },
}));

