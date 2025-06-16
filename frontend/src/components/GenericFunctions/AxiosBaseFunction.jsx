import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../baseUrls';
import apiEventEmitter from '../../utils/eventEmitter';

export const refreshToken = async () => {
  let tokenObj = Cookies.get('auth_token_agents');
  tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
  const refresh = tokenObj ? tokenObj.refresh : null;
  const country = Cookies.get('country');

  const response = await axios.post(
    `${API_URL}/api/user/token/refresh/`,
    {
      refresh: refresh,
    },
    {
      headers: {
        Country: country, // Adding the country header
      },
      withCredentials: true,
    }
  );

  if (response.status === 200) {
    console.log('Refresh token function triggered and token recieved');
    const newTokenObj = response.data;
    Cookies.set(
      'auth_token_agents',
      JSON.stringify({ access: newTokenObj.access, refresh: refresh }),
      {
        secure: true,
        sameSite: 'strict',
        path: '/',
      }
    );
    return Promise.resolve(response);
  } else {
    console.error(
      'Refresh token function triggered but token not recieved: ',
      response
    );
    return Promise.reject();
  }
};

// Create new Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use((config) => {
  let tokenObj = Cookies.get('auth_token_agents');
  tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
  const access = tokenObj ? tokenObj.access : null;
  const country = Cookies.get('country');

  config.headers['Authorization'] = `Bearer ${access}`;
  config.headers['Country'] = country;

  // Add API key header from localStorage (persists across tabs)
  const apiKey = localStorage.getItem('frontend_api_key_agents');
  const userType = localStorage.getItem('user_type_agents');

  if (apiKey) {
    const headerName =
      userType === 'staff' ? 'X-Frontend-API-Key-Agents' : 'X-Frontend-API-Key';
    config.headers[headerName] = apiKey;
    console.log(`Added API key header: ${headerName}`);
  }

  return config;
});

const refreshTokenEndpoint = `${API_URL}/api/user/token/refresh/`;

// Add a response interceptor
apiClient.interceptors.response.use(
  async (response) => {
    console.log('Response Headers:', response.headers); // 🔍 Debugging
    console.log(
      'X-API-Key-Expiration:',
      response.headers.get('x-api-key-expiration-agents')
    );
    // ✅ Capture API Key Expiration and Broadcast Event
    const apiKeyExpiration =
      response.headers['x-api-key-expiration-agents'] ||
      response.headers['x-api-key-expiration'];
    if (apiKeyExpiration) {
      apiEventEmitter.emit('apiKeyExpirationUpdated', apiKeyExpiration);
    }
    return response;
  },
  async (error) => {
    console.log(error);

    // Check for network error
    if (error.message === 'Network Error' && error.response === undefined) {
      error.message = 'Unable to connect to server. Please try again later.';
    }
    // Handle all API key related 403 errors
    else if (
      error.response?.status === 403 &&
      error.response?.data?.error &&
      [
        'Forbidden: Missing API key in request',
        'Forbidden: API key expired',
        'Forbidden: Invalid API key',
        'Forbidden: API key not found in storage',
      ].includes(error.response.data.error)
    ) {
      console.log(
        '403 Forbidden - API Key Issue Detected:',
        error.response.data.error
      );

      // 🔴 Emit an event so React components can handle logout
      apiEventEmitter.emit('logoutRequired');
    }
    // Handle 401 status errors
    else if (
      error.response?.status === 401 &&
      error.config.url !== refreshTokenEndpoint
    ) {
      // Check for "user_inactive" error code in the response data
      if (error.response.data?.code === 'user_inactive') {
        // Return the specific error message without refreshing the token
        return Promise.reject(new Error(error.response.data.detail));
      }

      // Attempt to refresh the token for other 401 errors
      try {
        await refreshToken();
        let tokenObj = Cookies.get('auth_token_agents');
        tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
        let { access } = tokenObj;

        // Update the authorization header with the new access token
        error.config.headers['Authorization'] = `Bearer ${access}`;

        // Re-add the API key header if it exists
        const apiKey = localStorage.getItem('frontend_api_key_agents');
        const userType = localStorage.getItem('user_type_agents');

        if (apiKey) {
          const headerName =
            userType === 'staff'
              ? 'X-Frontend-API-Key-Agents'
              : 'X-Frontend-API-Key';
          error.config.headers[headerName] = apiKey;
        }

        // Retry the failed request with the new token
        return apiClient.request(error.config);
      } catch {
        // Handle errors during the token refresh process (e.g., log out the user)
        console.log('Token refresh failed, logging out user');
        apiEventEmitter.emit('logoutRequired');
      }
    }

    // Reject all other errors as usual
    return Promise.reject(error);
  }
);

export default apiClient;
