// src/types/m/** A user's review of a show */
export interface Review {
  _id?: ObjectId;
  showId: ObjectId;
  userId?: ObjectId; // ID של המשתמש שכתב את הביקורת
  userName: string;
  userEmail?: string; // אימייל המשתמש (אופציונלי)
  rating: number;
  comment: string;
  createdAt: Date;
}
import { ObjectId } from "mongodb";

/** A theatre show as stored in MongoDB */
export interface Show {
  _id?: ObjectId;
  title: string;
  description: string;
  venue: string;
  posterUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** A user’s review of a show */
export interface Review {
  _id?: ObjectId;
  showId: ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/** The minimal data needed by the ShowCard client component */
export interface ShowCardData {
  id: string;
  title: string;
  venue: string;
  posterUrl?: string | null;
}
