import { create } from "zustand";

type FirebaseStateStoreT = {
  firebaseToken: string | null;
  showNotificationModal: boolean
  lastNotificationMessageData: Record<string, unknown> | null

  onUpdateToken: (v: string | null) => void;
  onShowNotificationModal: (v: boolean) => void;
  onUpdateLastNotificationMessage: (v: Record<string, unknown> | null) => void;
};

export const confirmationStore = create<FirebaseStateStoreT>((set) => ({
  firebaseToken: null,
  lastNotificationMessageData: null,
  showNotificationModal: false,
  onUpdateToken: (value: string | null) => {
    set(() => ({ firebaseToken: value }));
  },
  onShowNotificationModal: (value: boolean) => {
    set(() => ({ showNotificationModal: value }));
  },
  onUpdateLastNotificationMessage: (value: Record<string, unknown> | null) => {
    set(() => ({ lastNotificationMessageData: value }));
  },
}));
