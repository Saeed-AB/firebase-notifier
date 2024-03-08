import useCopy from "../hooks/useCopy";

type TopicItemPropsT = {
  label: string;
};

const TopicItem = (props: TopicItemPropsT) => {
  const { label } = props;
  const { isCopied, onCopy } = useCopy();

  return (
    <div
      className="bg-neutral-300 w-full text-center py-2 px-4 mb-2 rounded text-ellipsis cursor-pointer"
      {...(!isCopied && { onClick: () => onCopy(label) })}
    >
      {label} {isCopied && '(Copied!)'}
    </div>
  );
};

export default TopicItem;
