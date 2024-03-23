import { createClient } from "redis";
import { UPSTASH_URL } from "../constants";

const client = createClient({
  url: UPSTASH_URL,
});

client.on("error", function (err) {
  console.log(err);
});

export const cacheHandler = async <T>(
  key: string,
  expirationTime: number,
  callback: () => Promise<T>
) => {
  try {
    const cachedData = await client.get(key);
    if (cachedData !== null) {
      return JSON.parse(cachedData);
    } else {
      const data = await callback();
      await client.setEx(key, expirationTime, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export default client;
