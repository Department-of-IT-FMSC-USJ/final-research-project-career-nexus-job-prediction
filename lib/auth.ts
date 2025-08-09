interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthData {
  user: User;
  token: string;
}

// Simulate authentication with localStorage
export const login = async (email: string, password: string): Promise<AuthData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation (in real app, this would be server-side)
  if (email && password.length >= 6) {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email
    };
    
    const authData = {
      user: userData,
      token: 'mock-jwt-token-' + Date.now()
    };
    
    // Store in localStorage
    localStorage.setItem('auth', JSON.stringify(authData));
    
    return authData;
  }
  
  return null;
};

export const signup = async (name: string, email: string, password: string): Promise<AuthData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (name && email && password.length >= 6) {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email
    };
    
    const authData = {
      user: userData,
      token: 'mock-jwt-token-' + Date.now()
    };
    
    // Store in localStorage
    localStorage.setItem('auth', JSON.stringify(authData));
    
    return authData;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('auth');
};

export const getCurrentAuth = (): AuthData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth');
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    return null;
  }
};