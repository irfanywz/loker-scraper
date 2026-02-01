const API_BASE_URL = '';

export async function apiFetch(endpoint, options = {}) {    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
        
    if (config.body && typeof config.body !== 'string' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
                                                
            let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
            try {                
                const errorData = await response.clone().json(); 
                errorMessage = errorData.message || JSON.stringify(errorData);
            } catch (e) {                
            }
            
            throw new Error(errorMessage);
        }
        
        if (response.status === 204 || response.headers.get('content-length') === '0') {             
            return null; 
        }
        
        return await response.json();
        
    } catch (error) {        
        throw error;
    }
}