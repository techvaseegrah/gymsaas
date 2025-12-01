// Authentication utility functions
export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to refresh token
export const refreshToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        
        const response = await fetch('http://localhost:5002/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/superadmin/login';
        throw error;
    }
};