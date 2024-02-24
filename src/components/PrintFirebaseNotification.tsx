import Modal from "./Modal";
import { NotificationStateT } from "../sharedTypes";

type PrintFirebaseNotificationT = {
  notificationModal: NotificationStateT;
  onClose: () => void;
};

const PrintFirebaseNotification = (props: PrintFirebaseNotificationT) => {
  const { notificationModal } = props;

  if (!notificationModal.showModal || !notificationModal.data) return null;

  return (
    <Modal onClose={props.onClose}>
      <div className="w-full max-w-[800px]">
        <pre className="overflow-scroll">
          {JSON.stringify(notificationModal.data, null, 2)}
        </pre>
      </div>
    </Modal>
  );
};

export default PrintFirebaseNotification;
