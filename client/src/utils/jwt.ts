interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}


export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**

 * @param token 
 * @param bufferSeconds 
 * @returns 
 */
export const isTokenExpiredOrExpiringSoon = (token: string | null, bufferSeconds: number = 60): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expirationTime = decoded.exp * 1000; 
  const currentTime = Date.now();
  const bufferTime = bufferSeconds * 1000;
  
  return expirationTime <= (currentTime + bufferTime);
};


export const getTokenExpirationTime = (token: string | null): number | null => {
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return decoded.exp * 1000;
};


export const getTimeUntilExpiration = (token: string | null): number | null => {
  if (!token) return null;
  
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return null;
  
  const remaining = expirationTime - Date.now();
  return remaining > 0 ? remaining : 0;
};


export const hasRefreshToken = (): boolean => {
  return true;
};

