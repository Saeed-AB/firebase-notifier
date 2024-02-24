import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

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

const apiRequestServer = (config) => {
  const instance = axios.create({
    baseURL: "/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `key=${serverKey}`,
    },
  });

  return instance(config);
};

const getTopicAvailability = (topic) => {
  return !!topics[topic];
};

app.get("/get_topics", async (req, res) => {
  const token = req.query.token;

  try {
    const response = await apiRequestServer({
      method: "GET",
      url: `https://iid.googleapis.com/iid/info/${token}?details=true`,
    });
    const firebaseTopics = response.data?.rel?.topics ?? {};
    topics = firebaseTopics;
    res.send(firebaseTopics);
  } catch (e) {
    res.status(e?.response?.status).json({ message: e?.response?.data?.error ?? 'Something Wrong' });
  }
});

app.put("/topic_methods", async (req, res) => {
  const { token, method, topic } = req.body;
  const isTopicExist = getTopicAvailability(topic);

  if (isTopicExist && method === "Subscribe") {
    res.status(422).json({ message: "Topic Already Exist" });

    return;
  }

  if (!isTopicExist && method === "UnSubscribe") {
    res.status(422).json({ message: "Topic Not Exist" });

    return;
  }

  try {
    const response = await apiRequestServer({
      method: method === "Subscribe" ? "POST" : "DELETE",
      url: `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`,
    });

    if (method === "Subscribe") {
      topics = { ...topics, [topic]: { addDate: "" } };
    } else {
      delete topics[topic];
    }
    res.status(response.status).json({ message: `Topic ${method} Success` });
  } catch (e) {
    res.status(e?.response?.status).json({ message: e?.response?.data?.error ?? 'Something Wrong' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
