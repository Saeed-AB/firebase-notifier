import { RefObject, useEffect } from "react";

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useClickOutside;
