// This file is a Vercel serverless function.
// It requires the '@vercel/postgres' package.
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { gameName, guideType, platform, guide } = request.body;

    if (!gameName || !guideType || !platform || !guide) {
      return response.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create table if it doesn't exist. This is safe to run on every request.
    await sql`
      CREATE TABLE IF NOT EXISTS generation_history (
        id SERIAL PRIMARY KEY,
        game_name VARCHAR(255) NOT NULL,
        guide_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        guide_snippet TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Store a snippet to avoid saving massive amounts of text in the DB.
    const guideSnippet = guide.substring(0, 250) + (guide.length > 250 ? '...' : '');

    await sql`
      INSERT INTO generation_history (game_name, guide_type, platform, guide_snippet)
      VALUES (${gameName}, ${guideType}, ${platform}, ${guideSnippet});
    `;

    return response.status(201).json({ message: 'History saved' });
  } catch (error) {
    console.error('Failed to save history:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return response.status(500).json({ error: 'Failed to save history', details: errorMessage });
  }
}
