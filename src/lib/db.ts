import clientPromise from "@/lib/mongodb";
import { Collection } from "mongodb";
import { Show, Review } from "@/types/models";

export async function showsCollection(): Promise<Collection<Show>> {
  try {
    const client = await clientPromise;
    return client.db().collection<Show>("shows");
  } catch (error) {
    console.error("Failed to connect to shows collection:", error);
    throw error;
  }
}

export async function reviewsCollection(): Promise<Collection<Review>> {
  try {
    const client = await clientPromise;
    return client.db().collection<Review>("reviews");
  } catch (error) {
    console.error("Failed to connect to reviews collection:", error);
    throw error;
  }
}
