import { useState } from "react";

const useCopy = () => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setIsCopied(true);

    const timeout = setTimeout(() => {
      setIsCopied(false);
      clearTimeout(timeout);
    }, 3000);
  };

  return {
    isCopied,
    onCopy,
  };
};

export default useCopy;
