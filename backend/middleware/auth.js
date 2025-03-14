/**
 * Authentication middleware
 * This is a placeholder for the actual authentication middleware
 * In a real implementation, this would verify tokens from Azure AD
 */

const auth = (req, res, next) => {
  // Check for token in headers
  const token = req.header('x-auth-token');

  // If no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // In a real implementation, this would verify the token with Azure AD
    // For now, we'll just pass it through
    console.log('Token received:', token);
    
    // Add user info to request
    req.user = {
      id: 'placeholder-user-id',
      name: 'Placeholder User',
      role: 'data-inputter' // or 'manager'
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 