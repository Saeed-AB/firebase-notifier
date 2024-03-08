import { ReactNode, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const Modal = (props: ModalProps) => {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, props.onClose);

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            ref={ref}
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-4 sm:my-8"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
