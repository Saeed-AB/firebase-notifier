import toast from "react-hot-toast";

export const showToast = (statusCode: number, message: string) => {
  if (!message) return;

  if (statusCode === 200) {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
