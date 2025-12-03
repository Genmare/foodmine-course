import { connect, ConnectOptions } from "mongoose";

const dbUri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_LOCAL;

export const dbConnect = () => {
  connect(dbUri!, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  } as ConnectOptions).then(
    () => console.log("connect successfully"),
    error => console.error(error)
  );
};
