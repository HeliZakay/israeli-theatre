// src/app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4 space-y-12">
      {/* Hero Section - מתואם עם דף הבית */}
      <section className="py-8">
        <h1 className="text-3xl font-bold mb-6 text-right">
          אודות תיאטרון בישראל
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl text-right leading-relaxed">
          המקום שבו עולם התיאטרון הישראלי מתעורר לחיים. חוו חוויה תרבותית עשירה
          עם מאגר הצגות מתעדכן, ביקורות צופים, ותמונות מרהיבות.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-2 text-right">מאגר הצגות</h2>
          <p className="text-gray-700 text-right">
            עיינו במגוון הצגות מקלאסיקות מודרניות ועד היצירות המובילות של היום.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-2 text-right">
            ביקורות אמת
          </h2>
          <p className="text-gray-700 text-right">
            קראו חוות דעת מאנשים כמוכם ודרגו על פי חוויה אישית.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-2 text-right">
            תמונות וסרטונים
          </h2>
          <p className="text-gray-700 text-right">
            מצאו גלריה עשירה של פוסטרים, תמונות במה וסרטונים שיעוררו בכם השראה.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white rounded-lg shadow p-8 space-y-4">
        <h2 className="text-3xl font-bold text-right">למה אנחנו?</h2>
        <p className="text-gray-700 leading-relaxed text-right">
          ההשראה להקמת האתר נבעה מהצורך במקום אחד שיאגד את כל מה שיש לתיאטרון
          הישראלי להציע. במקום שבו תוכלו לתכנן ערב מושלם, ללמוד על הפקות חדשות
          ולשתף את חוויותיכם כדי שכל חובב תיאטרון ימצא את הדרך שלו לתיאטרון.
        </p>
        <p className="text-gray-700 leading-relaxed text-right">
          יחד, בונים קהילה תרבותית תוססת שבה כל קול נחשב – אז הצטרפו גם אתם!
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-theater-700 text-white font-semibold rounded-lg hover:bg-theater-800 transition"
        >
          גלו הצגות כעת
        </Link>
      </section>
    </main>
  );
}
