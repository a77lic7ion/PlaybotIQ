// This file is a Vercel serverless function.
// It requires the '@vercel/postgres' package.
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const { rows } = await sql`
      SELECT id, game_name, guide_type, platform, created_at 
      FROM generation_history 
      ORDER BY created_at DESC 
      LIMIT 10;
    `;
    return response.status(200).json(rows);
  } catch (error) {
    // If the table doesn't exist yet, it's not an error; just return an empty array.
    if (error.code === '42P01' || (error.message && error.message.includes('relation "generation_history" does not exist'))) {
      return response.status(200).json([]);
    }
    console.error('Failed to fetch history:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return response.status(500).json({ error: 'Failed to fetch history', details: errorMessage });
  }
}
