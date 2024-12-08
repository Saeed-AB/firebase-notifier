import { MouseEvent } from "react";
import useCopy from "@/hooks/useCopy";
import TrashIcon from "@/assets/icons/trash.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSubscribeUnSubscribe } from "@/apis";
import toast from "react-hot-toast";
import { confirmationStore } from "@/store/firebase";

type TopicItemPropsT = {
  label: string;
};

const TopicItem = (props: TopicItemPropsT) => {
  const { label } = props;
  const { isCopied, onCopy } = useCopy(1000);
  const queryClient = useQueryClient();
  const { firebaseToken } = confirmationStore((store) => store);

  const unSubscribeMutation = useMutation({
    mutationFn: handleSubscribeUnSubscribe,
    onSuccess: (res) => {
      if (res.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["topics"] });
        toast.success("Topic UnSubscribe Success");
      }
    },
  });

  const onDeleteTopic = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (firebaseToken) {
      unSubscribeMutation.mutate({
        method: "DELETE",
        token: firebaseToken,
        topic: label,
      });
    }
  };

  return (
    <div
      className="bg-neutral-300 w-full text-center py-2 px-4 mb-2 rounded text-ellipsis cursor-pointer relative group"
      {...(!isCopied &&
        !unSubscribeMutation.isPending && { onClick: () => onCopy(label) })}
    >
      <span className="line-clamp-1">
        {unSubscribeMutation.isPending
          ? "UnSubscribing on Progress..."
          : isCopied
          ? "Copied!"
          : label}
      </span>

      {!unSubscribeMutation.isPending && (
        <div
          className="absolute right-0 top-0 justify-center items-center h-full w-10 bg-neutral-400 hidden group-hover:flex"
          onClick={onDeleteTopic}
        >
          <TrashIcon />
        </div>
      )}
    </div>
  );
};

export default TopicItem;
