"use client";
import Modal from "../../components/atoms/Modal";
import { Fragment } from "react";
import { confirmationStore } from "../../store/firebase";
import { Button } from "../../components/atoms/Button";

const PrintFirebaseNotification = () => {
  const {
    showNotificationModal,
    lastNotificationMessageData,
    onShowNotificationModal,
  } = confirmationStore((store) => store);

  return (
    <Fragment>
      {!!lastNotificationMessageData && (
        <Button
          label="Show Recent Notification"
          onClick={() => onShowNotificationModal(true)}
        />
      )}

      {showNotificationModal && lastNotificationMessageData && (
        <Modal onClose={() => onShowNotificationModal(false)}>
          <div className="w-full max-w-[800px]">
            <pre className="overflow-scroll">
              {JSON.stringify(lastNotificationMessageData, null, 2)}
            </pre>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default PrintFirebaseNotification;
