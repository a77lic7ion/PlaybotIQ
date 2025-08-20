import { GuideType, Platform, Reference } from "../types";

export async function generateGameGuide(
  gameName: string,
  guideType: GuideType,
  platform: Platform
): Promise<{ guide: string; references: Reference[] }> {
  try {
    const response = await fetch('/api/generate-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameName, guideType, platform }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the server if available, otherwise provide a default
      throw new Error(data.error || `Server responded with status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error calling generate-guide API:", error);
    // Re-throw a user-friendly message to be displayed in the UI
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate guide. Please check your network connection and try again."
    );
  }
}
