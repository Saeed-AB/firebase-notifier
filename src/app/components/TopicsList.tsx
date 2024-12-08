import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";

import { confirmationStore } from "../../store/firebase";
import { getTopics } from "../../apis";
import { Topics } from "../../sharedTypes";
import TopicItem from "./TopicItem";

type TopicsListPropsT = {
  search: string;
};

const TopicsList = (props: TopicsListPropsT) => {
  const { search } = props;
  const { firebaseToken } = confirmationStore((store) => store);

  const {
    data: topics = {},
    isPending,
    error,
  } = useQuery({
    queryKey: ["topics"],
    enabled: !!firebaseToken,
    queryFn: () => getTopics(firebaseToken ?? ""),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (data) => data.data.topics,
  });

  const getFilteredTopics = () => {
    if (!search.trim()) return topics;
    let newTopics: Topics = {};

    Object.keys(topics).forEach((topicKey) => {
      if (topicKey.includes(search)) {
        newTopics = {
          ...newTopics,
          [topicKey]: topics[topicKey],
        };
      }
    });

    return newTopics;
  };

  const filteredTopics = getFilteredTopics();

  return (
    <Fragment>
      {Object.keys(filteredTopics).length === 0 && (
        <>
          {isPending && <h6>Loading...</h6>}
          {!isPending && !error?.message && <h6>No Topics.</h6>}
          {error?.message && <h6>{error.message}</h6>}
        </>
      )}

      {Object.keys(filteredTopics).length !== 0 && !isPending && (
        <div className="max-h-[300px] w-full overflow-x-hidden flex flex-col items-center">
          {Object.keys(filteredTopics).map((key) => {
            return <TopicItem key={key} label={key} />;
          })}
        </div>
      )}
    </Fragment>
  );
};

export default TopicsList;
