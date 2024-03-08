import useCopy from "../hooks/useCopy";

type TopicItemPropsT = {
  label: string;
};

const TopicItem = (props: TopicItemPropsT) => {
  const { label } = props;
  const { isCopied, onCopy } = useCopy(1000);

  return (
    <div
      className="bg-neutral-300 w-full text-center py-2 px-4 mb-2 rounded text-ellipsis cursor-pointer"
      {...(!isCopied && { onClick: () => onCopy(label) })}
    >
      <span className="line-clamp-1">
        {isCopied ? "Copied!" : label}
      </span>
    </div>
  );
};

export default TopicItem;
