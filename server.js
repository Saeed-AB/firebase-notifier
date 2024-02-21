import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config({ path: "./.env" });
app.use(cors());
app.use(express.json());

let topics = {};
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server Working Correctly",
  });
});

// eslint-disable-next-line no-undef
const serverKey = process.env.REACT_APP_FIREBASE_SERVER_KEY;

const getTopicAvailability = (topic) => {
  return !!topics[topic];
};

app.get("/get_topics", async (req, res) => {
  const token = req.query.token;

  const response = await fetch(
    `https://iid.googleapis.com/iid/info/${token}?details=true`,
    {
      method: "GET",
      headers: {
        Authorization: "key=" + serverKey,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  const firebaseTopics = data?.rel?.topics ?? {};
  topics = firebaseTopics;
  res.send(firebaseTopics);
});

app.put("/topic_methods", async (req, res) => {
  const { token, method, topic } = req.body;
  const isTopicExist = getTopicAvailability(topic);

  if (isTopicExist && method === "Subscribe") {
    res.status(400).json({ message: "Topic Already Exist" });

    return;
  }

  if (!isTopicExist && method === "UnSubscribe") {
    res.status(400).json({ message: "Topic Not Exist" });

    return;
  }

  const response = await fetch(
    "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic,
    {
      method: method === "Subscribe" ? "POST" : "DELETE",
      headers: {
        Authorization: "key=" + serverKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (method === "Subscribe") {
    topics = { ...topics, [topic]: { addDate: "" } };
  } else {
    delete topics[topic];
  }

  const data = await response.json();

  res.status(response.status === 200 ? 200 : 400).json({
    message:
      response.status === 200
        ? `Topic ${method} Success`
        : data?.error ?? `Error On ${method}`,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
