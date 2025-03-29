/**
 * Simplified authentication service for demonstration purposes
 * This is a mock implementation that simulates Google OAuth authentication
 */
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    
    // Create a mock user for testing
    this.mockUser = {
      account: {
        name: 'Usuário Google',
        username: 'usuario@gmail.com',
        idToken: 'mock-id-token',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      }
    };
  }

  async initialize() {
    console.log('Auth service initialized');
    this.isInitialized = true;
    return true;
  }

  async login() {
    console.log('Login triggered');
    
    // Always return success for the mock implementation
    this.currentUser = this.mockUser;
    return this.mockUser;
  }

  async acquireToken() {
    if (!this.currentUser) {
      return null;
    }
    
    return {
      accessToken: 'mock-access-token',
      idToken: this.currentUser.account.idToken,
      expiresOn: new Date(Date.now() + 3600 * 1000) // 1 hour from now
    };
  }

  logout() {
    this.currentUser = null;
    console.log('User logged out');
  }

  getAccount() {
    return this.currentUser ? this.currentUser.account : null;
  }
}

export const authService = new AuthService();
