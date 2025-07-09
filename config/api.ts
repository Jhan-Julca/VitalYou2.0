// API Configuration
export const API_CONFIG = {
  // Change this to your actual API URL
  BASE_URL: 'http://localhost:8080/api',
  
  // For Android emulator, use: 'http://10.0.2.2:8080/api'
  // For iOS simulator, use: 'http://localhost:8080/api'
  // For physical device, use your computer's IP: 'http://192.168.1.XXX:8080/api'
  
  TIMEOUT: 10000, // 10 seconds
  
  // Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    TEST: '/test',
    USERS: {
      BASE: '/users',
      LOGIN: '/users/login',
      REGISTER: '/users/register',
    },
    WORKOUTS: {
      BASE: '/workouts',
      BY_CATEGORY: '/workouts/category',
      BY_DIFFICULTY: '/workouts/difficulty',
    },
    SESSIONS: {
      BASE: '/workout-sessions',
      BY_USER: '/workout-sessions/user',
      COMPLETE: '/workout-sessions/{id}/complete',
    },
  },
};

// Network detection helper
export async function isAPIAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Get the appropriate API URL based on platform
export function getAPIUrl(): string {
  // You can add platform-specific logic here if needed
  return API_CONFIG.BASE_URL;
}
