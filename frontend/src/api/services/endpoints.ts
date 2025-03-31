// Base URL is configured in an environment variable, with a fallback for development.
export const API_BASE_URL = 'http://localhost:5001';


export const ENDPOINTS = {
  testToken: `${API_BASE_URL}/test/token`,
    testSupabase: `${API_BASE_URL}/test/supabase`,
    testUsers: `${API_BASE_URL}/users`,
  // Add other endpoints here...
};

// Alternatively, you can define helper functions:
export async function fetchProtectedData(token: string) {
  const response = await fetch(ENDPOINTS.testToken, { // Change to your endpoint for testing
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}