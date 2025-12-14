import { neon } from '@netlify/neon';

// We do NOT paste the URL here. 
// The library automatically finds NETLIFY_DATABASE_URL from your settings.
const sql = neon();

export default async (req) => {
  try {
    // This is a test query to get the current time from the database
    // Later, we will change this to: SELECT * FROM questions
    const [data] = await sql`SELECT NOW() as current_time`;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response("Database Error", { status: 500 });
  }
};