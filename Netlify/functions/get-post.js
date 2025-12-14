import { neon } from '@netlify/neon';

const sql = neon();

export default async (req) => {
  // This is a placeholder ID. In a real app, you'd get this from the URL.
  const postId = 1; 

  try {
    const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;

    // Return the data as JSON
    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response("Error fetching data", { status: 500 });
  }
};