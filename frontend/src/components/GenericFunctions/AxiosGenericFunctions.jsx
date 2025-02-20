import apiClient from './AxiosBaseFunction';

export const fetchData = async (token, endpoint) => {
    try {
        const uri = `${endpoint}`;
        const response = await apiClient.get(uri);

        if (!(response.status >= 200 && response.status < 300)) {
            console.error(`Error: Received status code ${response.status}`);
            return null;
        } else {
            console.log('Success:', response);
        }
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);

        if (error.code === 'ERR_NETWORK') {
            // Handle network error when the server is down
            return {status: 0, data: "Unable to connect to server. Please try again later."};
        }

        if (error.response) {
            return error.response; // Return the response if available
        } else {
            return {status: 503, data: "Service Unavailable"}; // Fallback to 503 if no other info
        }
    }
};

export const postData = async (token, endpoint, data) => {
  try {
    const uri = `${endpoint}`;
    const response = await apiClient.post(uri, data);
    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // If using fetch, you might need to parse the response as JSON
      response
        .json()
        .then((data) => {
          console.error('Response data:', data);
        })
        .catch((err) => {
          console.error('Failed to parse response data:', err);
        });
    } else {
      // Handle successful response
      console.log('Success:', response);
    }
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    return error.response;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const uri = `${endpoint}`;
    const response = await apiClient.patch(uri, data);
    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // If using fetch, you might need to parse the response as JSON
      response
        .json()
        .then((data) => {
          console.error('Response data:', data);
        })
        .catch((err) => {
          console.error('Failed to parse response data:', err);
        });
    } else {
      // Handle successful response
      console.log('Success:', response);
    }
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    return error.response;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const uri = `${endpoint}`;
    const response = await apiClient.delete(uri);
    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // If using fetch, you might need to parse the response as JSON
      response
        .json()
        .then((data) => {
          console.error('Response data:', data);
        })
        .catch((err) => {
          console.error('Failed to parse response data:', err);
        });
    } else {
      // Handle successful response
      console.log('Success:', response);
    }
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error.response;
  }
};

export const downloadFileAxios = async (token, endpoint) => {
  try {
    const uri = `${endpoint}`;
    const response = await apiClient.get(uri, {
      responseType: 'blob', // Important to handle binary data
    });
    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // If using fetch, you might need to parse the response as JSON
      response
        .json()
        .then((data) => {
          console.error('Response data:', data);
        })
        .catch((err) => {
          console.error('Failed to parse response data:', err);
        });
    } else {
      // Handle successful response
      console.log('Success:', response);
    }
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error.response;
  }
};

export const uploadFile = async (endpoint, formData) => {
  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // If using fetch, you might need to parse the response as JSON
      response
        .json()
        .then((data) => {
          console.error('Response data:', data);
        })
        .catch((err) => {
          console.error('Failed to parse response data:', err);
        });
    } else {
      // Handle successful response
      console.log('Success:', response);
    }
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    return error.response; // Return the response in case of an error
  }
};

export const postPdfRequest = async (token, endpoint, data) => {
  try {
    const uri = `${endpoint}`;

    // Set up the config for the axios request, including headers for JWT token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT token
      },
      responseType: 'blob', // Ensure the response is treated as a blob
    };

    // Send the POST request to the Django backend
    const response = await apiClient.post(uri, data, config);

    if (!(response.status >= 200 && response.status < 300)) {
      // Log the response status and data to the console if the status is not in the 200 range
      console.error(`Error: Received status code ${response.status}`);

      // Since this is a blob response, parse any error message
      const errorData = await response.data.text();
      console.error('Response data:', errorData);
    } else {
      // Handle successful response (No additional handling here since it's a blob)
      console.log('Success:', response);
    }

    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return error.response;
  }
};
