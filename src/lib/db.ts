import clientPromise from '@/lib/mongodb';
import { Collection } from 'mongodb';
import { Show, Review } from '@/types/models';

export async function showsCollection(): Promise<Collection<Show>> {
  const client = await clientPromise;
  return client.db().collection<Show>('shows');
}

export async function reviewsCollection(): Promise<Collection<Review>> {
  const client = await clientPromise;
  return client.db().collection<Review>('reviews');
}