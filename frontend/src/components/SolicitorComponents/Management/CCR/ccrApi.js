// ccrApi.js - Updated to extract filename from Content-Disposition header
import {
  deleteData,
  fetchData,
  postData,
  postPdfRequest,
} from '../../../GenericFunctions/AxiosGenericFunctions';

export const downloadExistingSubmissionFile = async (submissionId) => {
  try {
    // First, try to get the existing file path from the submission
    const response = await fetchData(
      null,
      `api/ccr/submission/${submissionId}/`
    );

    if (response.status >= 200 && response.status < 300) {
      const submission = response.data;

      // Check if file exists and has a valid file_path
      if (submission.file_path && submission.file_path !== '') {
        // Try to download the existing file
        try {
          const fileResponse = await fetchData(
            null,
            `api/ccr/file/${submissionId}/`,
            {
              responseType: 'blob',
            }
          );

          if (fileResponse.status >= 200 && fileResponse.status < 300) {
            // Extract filename from submission data or use a default
            const filename =
              submission.file_path.split('/').pop() ||
              `ccr_submission_${submission.reference_date}.txt`;

            return {
              success: true,
              blob: fileResponse.data,
              filename,
              recordCount: submission.total_records,
              referenceDate: submission.reference_date,
              isExisting: true, // Flag to indicate this is an existing file
            };
          }
        } catch (downloadError) {
          console.log(
            'Existing file download failed, will regenerate:',
            downloadError.message
          );
        }
      }
    }

    // If we get here, either the submission doesn't exist, has no file, or file download failed
    // Fall back to regenerating the file
    console.log(
      'Falling back to file regeneration for submission:',
      submissionId
    );
    return await downloadSubmissionFile(submissionId);
  } catch (error) {
    console.error('Error in downloadExistingSubmissionFile:', error);

    // Final fallback: try regeneration
    try {
      return await downloadSubmissionFile(submissionId);
    } catch (regenError) {
      return {
        success: false,
        error: `Failed to download or regenerate file: ${error.message}`,
      };
    }
  }
};

// Alternative safe version that tries postData first, then postPdfRequest
export const generateCCRSubmissionSafe = async (data) => {
  try {
    console.log('Trying safe CCR submission with data:', data);

    const requestData = {
      test_mode: data.testMode,
    };

    if (data.testMode && data.forceDate) {
      requestData.force_date = data.forceDate;
    } else if (data.referenceDate) {
      requestData.reference_date = data.referenceDate;
    }

    console.log('Final request data:', requestData);

    // First, try with regular postData to catch validation errors early
    try {
      const jsonResponse = await postData(
        null,
        'api/ccr/generate/',
        requestData
      );

      // If postData returns an error in JSON format, handle it
      if (jsonResponse.status >= 400 && jsonResponse.data?.error) {
        return {
          success: false,
          error: jsonResponse.data.error,
        };
      }

      // If postData succeeds but doesn't return a file, fall through to PDF request
      console.log(
        'postData succeeded, but trying postPdfRequest for file download'
      );
    } catch (postError) {
      console.log(
        'postData failed, proceeding with postPdfRequest:',
        postError.message
      );
    }

    // Use postPdfRequest for the actual file download
    const pdfResponse = await postPdfRequest(
      null,
      'api/ccr/generate/',
      requestData
    );

    if (pdfResponse.status >= 200 && pdfResponse.status < 300) {
      // Debug: Log ALL response headers for safe version
      console.log('=== SAFE VERSION - ALL RESPONSE HEADERS ===');
      console.log('Full headers object:', pdfResponse.headers);
      console.log(
        'Headers as JSON:',
        JSON.stringify(pdfResponse.headers, null, 2)
      );
      console.log('Available header keys:', Object.keys(pdfResponse.headers));
      console.log('=== END SAFE VERSION HEADERS DEBUG ===');

      const recordCount = pdfResponse.headers['x-ccr-record-count'];
      const referenceDate = pdfResponse.headers['x-ccr-reference-date'];
      const isTestMode = pdfResponse.headers['x-ccr-test-mode'] === 'True';

      // Extract the actual filename from the Content-Disposition header
      const contentDisposition = pdfResponse.headers['content-disposition'];
      const filename =
        extractFilenameFromHeader(contentDisposition) || 'ccr_submission.txt';

      return {
        success: true,
        blob: pdfResponse.data,
        recordCount,
        referenceDate,
        isTestMode,
        filename,
      };
    } else {
      // Handle PDF request error
      let errorMessage = 'Failed to generate submission';

      if (pdfResponse.data instanceof Blob) {
        try {
          const errorText = await pdfResponse.data.text();
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse PDF error blob:', parseError);
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('CCR submission safe error:', error);

    let errorMessage = 'Error generating submission';

    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Could not parse error blob:', parseError);
      }
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const updateSubmissionStatus = async (
  submissionId,
  status,
  notes = '',
  errorDetails = '',
  forceAdmin = false
) => {
  try {
    const response = await postData(null, 'api/ccr/status/update/', {
      submission_id: submissionId,
      status,
      notes,
      error_details: errorDetails,
      force_admin: forceAdmin,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to update status',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error updating status',
    };
  }
};

export const getSubmissionDetails = async (submissionId) => {
  try {
    const response = await fetchData(
      null,
      `api/ccr/submission/${submissionId}/`
    );

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch submission details',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error fetching submission details',
    };
  }
};

export const addErrorRecord = async (submissionId, errorData) => {
  try {
    const response = await postData(null, 'api/ccr/errors/add/', {
      submission_id: submissionId,
      error_type: errorData.errorType,
      error_description: errorData.errorDescription,
      line_number: errorData.lineNumber,
      original_line_content: errorData.originalLineContent,
      contract_id: errorData.contractId,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to add error record',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error adding error record',
    };
  }
};

export const resolveErrorRecord = async (
  errorRecordId,
  resolutionStatus,
  resolutionNotes = '',
  carryForward = false
) => {
  try {
    const response = await postData(null, 'api/ccr/errors/resolve/', {
      error_record_id: errorRecordId,
      resolution_status: resolutionStatus,
      resolution_notes: resolutionNotes,
      carry_forward: carryForward,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to resolve error record',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error resolving error record',
    };
  }
};

export const uploadCCRResponse = async (submissionId, responseFile) => {
  try {
    const formData = new FormData();
    formData.append('submission_id', submissionId);
    formData.append('response_file', responseFile);

    const response = await postData(
      null,
      'api/ccr/response/upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to upload CCR response',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error uploading CCR response',
    };
  }
};

// Enhanced history function with error statistics
export const getCCRHistoryEnhanced = async ({ showTest = true } = {}) => {
  try {
    const response = await fetchData(
      null,
      `api/ccr/history/?show_test=${showTest}`
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Failed to load history');
    }
  } catch (error) {
    throw new Error(error.message || 'Error loading history');
  }
};

// Helper function to extract filename from Content-Disposition header
const extractFilenameFromHeader = (contentDisposition) => {
  if (!contentDisposition) return null;

  // Try to match filename="..." or filename=... patterns
  const filenameMatch = contentDisposition.match(
    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  );
  if (filenameMatch && filenameMatch[1]) {
    // Remove quotes if present
    return filenameMatch[1].replace(/['"]/g, '');
  }
  return null;
};

// Keep all your existing functions (getCCRPreview, generateCCRSubmission, etc.)
export const getCCRPreview = async ({ testDate, referenceDate }) => {
  try {
    // Use either testDate or referenceDate parameter
    const dateParam = testDate
      ? `test_date=${testDate}`
      : `reference_date=${referenceDate}`;
    const response = await fetchData(null, `api/ccr/preview/?${dateParam}`);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Failed to load preview');
    }
  } catch (error) {
    throw new Error(error.message || 'Error loading preview');
  }
};

export const getCCRHistory = async ({ showTest = true } = {}) => {
  try {
    const response = await fetchData(
      null,
      `api/ccr/history/?show_test=${showTest}`
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Failed to load history');
    }
  } catch (error) {
    throw new Error(error.message || 'Error loading history');
  }
};

export const generateCCRTestSequence = async ({
  startDate,
  months = 3,
  returnFiles = true,
}) => {
  try {
    const response = await postData(null, 'api/ccr/test/sequence/', {
      start_date: startDate,
      months,
      return_files: returnFiles,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to generate sequence',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error generating sequence',
    };
  }
};

export const clearCCRTestData = async () => {
  try {
    const response = await deleteData('api/ccr/test/clear/');

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to clear test data',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error clearing test data',
    };
  }
};

export const downloadSubmissionFile = async (submissionId) => {
  try {
    const response = await postPdfRequest(null, 'api/ccr/download/', {
      submission_id: submissionId,
    });

    if (response.status >= 200 && response.status < 300) {
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename="')[1].split('"')[0]
        : 'ccr_submission_regenerated.txt';

      return {
        success: true,
        blob: response.data,
        filename,
        recordCount: response.headers['x-ccr-record-count'],
        referenceDate: response.headers['x-ccr-reference-date'],
      };
    } else {
      // Handle error response from blob
      let errorMessage = 'Failed to download file';
      if (response.data instanceof Blob) {
        try {
          const errorText = await response.data.text();
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error blob:', parseError);
        }
      }

      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Error downloading submission file:', error);

    let errorMessage = 'Error downloading file';
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Could not parse error response blob:', parseError);
      }
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    return { success: false, error: errorMessage };
  }
};

export const generateCCRSubmission = async (data) => {
  try {
    console.log('Sending CCR submission request with data:', data);

    // Use the correct parameter names that match your Django view
    const requestData = {
      test_mode: data.testMode,
    };

    if (data.testMode && data.forceDate) {
      requestData.force_date = data.forceDate;
    } else if (data.referenceDate) {
      requestData.reference_date = data.referenceDate;
    }

    console.log('Final request data:', requestData);

    // Use postPdfRequest for file downloads
    const response = await postPdfRequest(
      null,
      'api/ccr/generate/',
      requestData
    );

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.status >= 200 && response.status < 300) {
      // Extract headers and return file data
      const recordCount = response.headers['x-ccr-record-count'];
      const referenceDate = response.headers['x-ccr-reference-date'];
      const isTestMode = response.headers['x-ccr-test-mode'] === 'True';

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const filename = extractFilenameFromHeader(contentDisposition);

      console.log('Extracted filename:', filename);

      return {
        success: true,
        blob: response.data,
        recordCount,
        referenceDate,
        isTestMode,
        filename: filename || 'ccr_submission.txt', // fallback filename
      };
    } else {
      // Handle error response
      console.error('Error response:', response);

      let errorMessage = 'Failed to generate submission';

      // If response.data is a Blob, we need to read it
      if (response.data instanceof Blob) {
        try {
          const errorText = await response.data.text();
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          console.log('Parsed error from blob:', errorData);
        } catch (parseError) {
          console.error('Could not parse error blob:', parseError);
        }
      } else if (response.data?.error) {
        errorMessage = response.data.error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('CCR submission error:', error);

    // Handle Axios error with response
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);

      let errorMessage = 'Failed to generate submission';

      // If the error response data is a Blob, try to read it
      if (error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          console.log('Parsed error from error blob:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response blob:', parseError);
        }
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: false,
      error: error.message || 'Error generating submission',
    };
  }
};

// Optional: Simulate loan settlement for testing
export const simulateLoanSettlement = async ({ loanId, settlementDate }) => {
  try {
    const response = await postData(null, 'api/ccr/test/settle/', {
      loan_id: loanId,
      settlement_date: settlementDate,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to simulate settlement',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error simulating settlement',
    };
  }
};
