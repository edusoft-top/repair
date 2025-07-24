// utils/api.js

// ใช้ environment variable จาก .env
const API_BASE = process.env.REACT_APP_API_BASE_URL;

// ดึง configuration อื่นๆ จาก environment
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000; // 30 seconds
const API_RETRY_ATTEMPTS = parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3;
const ENABLE_API_LOGGING = process.env.REACT_APP_ENABLE_API_LOGGING === 'true';

// Log API configuration (เฉพาะ development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    API_BASE,
    API_TIMEOUT,
    API_RETRY_ATTEMPTS,
    ENABLE_API_LOGGING
  });
}

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: API_TIMEOUT,
    ...options,
  };

  // Log API calls (เฉพาะเมื่อเปิดใช้งาน)
  if (ENABLE_API_LOGGING) {
    console.log(`🌐 API Call: ${config.method || 'GET'} ${API_BASE}${endpoint}`, {
      headers: config.headers,
      body: config.body
    });
  }

  let lastError;
  
  // Retry logic
  for (let attempt = 1; attempt <= API_RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Always try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create error object
        data = {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`
        };
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Log successful response (เฉพาะเมื่อเปิดใช้งาน)
      if (ENABLE_API_LOGGING) {
        console.log(`✅ API Success: ${endpoint}`, data);
      }
      
      return data;
      
    } catch (error) {
      lastError = error;
      
      // Log error (เฉพาะเมื่อเปิดใช้งาน)
      if (ENABLE_API_LOGGING) {
        console.warn(`❌ API Error (Attempt ${attempt}/${API_RETRY_ATTEMPTS}): ${endpoint}`, error);
      }
      
      // Don't retry on certain errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      if (error.message.includes('401') || error.message.includes('403')) {
        // Authentication errors - don't retry
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === API_RETRY_ATTEMPTS) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  console.error('API call failed after all attempts:', lastError);
  throw lastError;
};

export const uploadFile = async (file, repairRequestId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('repair_request_id', repairRequestId);

  const token = localStorage.getItem('token');
  
  // Log file upload (เฉพาะเมื่อเปิดใช้งาน)
  if (ENABLE_API_LOGGING) {
    console.log('📎 File Upload:', {
      fileName: file.name,
      fileSize: file.size,
      repairRequestId
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 2); // Double timeout for file uploads

  try {
    const response = await fetch(`${API_BASE}/attachments`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Upload failed: HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    // Log successful upload (เฉพาะเมื่อเปิดใช้งาน)
    if (ENABLE_API_LOGGING) {
      console.log('✅ File Upload Success:', result);
    }
    
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('File upload timeout');
    }
    
    console.error('File upload failed:', error);
    throw error;
  }
};

// Helper function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

// Helper function to get API base URL (useful for debugging)
export const getApiBaseUrl = () => API_BASE;