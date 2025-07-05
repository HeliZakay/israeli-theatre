// src/app/page.tsx
import ShowCard from "@/components/ShowCard";
import ReviewCard from "@/components/ReviewCard";
import { showsCollection, reviewsCollection } from "@/lib/db";
import type { ShowCardData } from "@/types/models";

export default async function HomePage() {
  let shows: ShowCardData[] = [];
  let reviews: {
    _id?: string;
    showId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
    userId?: string;
    userEmail?: string;
    showTitle?: string;
    showPosterUrl?: string | null;
  }[] = [];
  try {
    // Fetch shows from database
    const rawShows = await (await showsCollection()).find().toArray();

    shows = rawShows.map((s) => ({
      id: s._id!.toString(),
      title: s.title,
      venue: s.venue,
      posterUrl: s.posterUrl ?? null,
    }));

    // Build maps for quick lookup by id
    const showTitleMap = shows.reduce<Record<string, string>>((acc, s) => {
      acc[s.id] = s.title;
      return acc;
    }, {});

    const showPosterMap = shows.reduce<Record<string, string | null>>(
      (acc, s) => {
        acc[s.id] = s.posterUrl ?? null;
        return acc;
      },
      {}
    );

    // Fetch latest 5 reviews
    const rawReviews = await (await reviewsCollection())
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    reviews = rawReviews.map((r) => ({
      _id: r._id?.toString(),
      showId: r.showId.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userId: r.userId?.toString(),
      userEmail: r.userEmail,
      showTitle: showTitleMap[r.showId.toString()] || "הצגה לא ידועה",
      showPosterUrl: showPosterMap[r.showId.toString()] ?? null,
    }));
  } catch (error) {
    console.error("Database connection failed:", error);
    // Fallback to mock data if database fails
    shows = [
      {
        id: "1",
        title: "קזבלן",
        venue: "תיאטרון הבימה",
        posterUrl: "/images/kazablan.jpg",
      },
      {
        id: "2",
        title: "חבדניקים",
        venue: "תיאטרון הקאמרי",
        posterUrl: "/images/hachabadnikim.jpg",
      },
      {
        id: "3",
        title: "שווצברים",
        venue: "תיאטרון הביתן",
        posterUrl: "/images/shusterman.jpg",
      },
      {
        id: "4",
        title: "אפס ביחס אנוש",
        venue: "תיאטרון הסימטה",
        posterUrl: "/images/efes-beyachas-enosh.jpg",
      },
      {
        id: "5",
        title: "מיקי מציל",
        venue: "תיאטרון הילדים",
        posterUrl: "/images/miki-matzil.jpg",
      },
      {
        id: "6",
        title: "הכל אודות איב",
        venue: "תיאטרון הקלוב",
        posterUrl: "/images/hakol-odot-eve.jpg",
      },
    ];

    reviews = [
      {
        _id: "507f1f77bcf86cd799439011",
        showId: "507f1f77bcf86cd799439011",
        userName: "דוד כהן",
        rating: 5,
        comment: "הצגה מדהימה! המוזיקה והמשחק היו ברמה גבוהה מאוד.",
        createdAt: new Date("2024-12-15"),
        userEmail: "david@example.com",
        showTitle: "קזבלן",
        showPosterUrl: "/images/kazablan.jpg",
      },
      {
        _id: "507f1f77bcf86cd799439012",
        showId: "507f1f77bcf86cd799439012",
        userName: "רחל לוי",
        rating: 4,
        comment: "הצגה מצחיקה ומרגשת, מומלץ לכל המשפחה.",
        createdAt: new Date("2024-12-10"),
        userEmail: "rachel@example.com",
        showTitle: "חבדניקים",
        showPosterUrl: "/images/hachabadnikim.jpg",
      },
      {
        _id: "507f1f77bcf86cd799439013",
        showId: "507f1f77bcf86cd799439013",
        userName: "אבי אברהם",
        rating: 3,
        comment: "הצגה סבירה, יש מקום לשיפור בעלילה.",
        createdAt: new Date("2024-12-05"),
        userEmail: "avi@example.com",
        showTitle: "שווצברים",
        showPosterUrl: null,
      },
    ];
  }

  return (
    <main className="container mx-auto p-4 space-y-12">
      {/* Shows grid */}
      <section>
        <h1 className="text-3xl font-bold mb-6 text-right text-theater-900">
          הצגות משחקות
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      {/* Recent reviews section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-right text-theater-800">
          חוות דעת אחרונות
        </h2>
        <ul className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r._id?.toString()} review={r} />
          ))}
        </ul>
      </section>
    </main>
  );
}
