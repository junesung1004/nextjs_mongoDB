import { MongoClient } from "mongodb";

const url = "mongodb+srv://june1274:june1274@june.yacyygx.mongodb.net/";
const options = {};
let connectDB;

if (process.env.NODE_ENV === "development") {
  // npm run dev 일 때
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect();
  }
  connectDB = global._mongo;
} else {
  // npm run build 일 때
  connectDB = new MongoClient(url, options).connect();
}

export { connectDB };
