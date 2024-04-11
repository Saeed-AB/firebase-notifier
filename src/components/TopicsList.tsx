import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";

import { confirmationStore } from "../store/firebase";
import { getTopics } from "../apis";
import { Topics } from "../sharedTypes";
import TopicItem from "./TopicItem";

type TopicsListPropsT = {
  search: string;
};

const TopicsList = (props: TopicsListPropsT) => {
  const { search } = props;
  const { firebaseToken } = confirmationStore((store) => store);

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    enabled: !!firebaseToken && !!process.env.REACT_APP_FIREBASE_SERVER_KEY,
    queryFn: () => getTopics(firebaseToken ?? ""),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const getFilteredTopics = () => {
    const topics = topicsQuery.data ?? {};
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
      {topicsQuery.isPending || topicsQuery.isRefetching ? (
        "loading..."
      ) : (
        <div className="max-h-[300px] w-full overflow-x-hidden flex flex-col items-center">
          {Object.keys(filteredTopics).map((key) => {
            return <TopicItem key={key} label={key} />;
          })}

          {!Object.keys(filteredTopics).length && (
            <div className="text-center">No Topics</div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default TopicsList;
