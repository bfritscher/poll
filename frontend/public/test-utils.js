/**
 * Test Utilities for Poll Application
 *
 * These utilities help you simulate different users in development mode.
 * Open your browser console and use these functions to switch between
 * admin and user roles for testing purposes.
 *
 * Requirements:
 * 1. Backend must be running with NODE_ENV=development or ENABLE_TEST_MODE=true
 * 2. You must have a valid JWT token already stored
 */

// JWT Secret - this should match your backend JWT_SHARED_SECRET
// In a real app, this would not be exposed client-side!
const JWT_SECRET = '';

/**
 * Simple base64url encode function
 */
function base64urlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Simple base64url decode function
 */
function base64urlDecode(str) {
  str += new Array(5 - str.length % 4).join('=');
  return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
}

/**
 * Simple HMAC-SHA256 implementation for JWT signing
 * Note: This is a simplified implementation for testing only!
 */
async function hmacSha256(key, data) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return new Uint8Array(signature);
}

/**
 * Sign a JWT token (client-side for testing only!)
 */
async function signJWT(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = await hmacSha256(JWT_SECRET, data);
  const encodedSignature = base64urlEncode(String.fromCharCode(...signature));

  return `${data}.${encodedSignature}`;
}

/**
 * Decode a JWT token (client-side only for testing)
 */
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(base64urlDecode(parts[1]));
    return payload;
  } catch (e) {
    console.error('Invalid JWT token');
    return null;
  }
}

/**
 * Get the current stored JWT token
 */
function getCurrentToken() {
  return localStorage.getItem('jwt');
}

/**
 * Get current user info from stored JWT
 */
function getCurrentUser() {
  const token = getCurrentToken();
  if (!token) {
    console.log('No JWT token found in localStorage');
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) return null;

  if (payload.testMode) {
    return {
      original: {
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname
      },
      test: {
        email: payload.testEmail,
        firstname: payload.testFirstname,
        lastname: payload.testLastname,
        isAdmin: payload.forceAdmin
      },
      mode: 'test'
    };
  } else {
    return {
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      mode: 'normal'
    };
  }
}

/**
 * Create and store a modified JWT token for testing
 */
async function createAndStoreTestToken(userType, userId = '1') {
  const currentToken = getCurrentToken();
  if (!currentToken) {
    console.error('No current JWT token found. Please authenticate first.');
    return false;
  }

  const originalPayload = decodeJWT(currentToken);
  if (!originalPayload) {
    console.error('Cannot decode current JWT token');
    return false;
  }

  // Create modified payload with test flags
  const testPayload = {
    ...originalPayload,
    testMode: true,
    testEmail: userType === 'admin' ? 'test.admin@example.com' : `test.user${userId}@example.com`,
    testFirstname: userType === 'admin' ? 'Test' : `User${userId}`,
    testLastname: userType === 'admin' ? 'Admin' : 'Test',
    forceAdmin: userType === 'admin'
  };

  console.log('Creating test token for:', {
    userType,
    email: testPayload.testEmail,
    name: `${testPayload.testFirstname} ${testPayload.testLastname}`,
    isAdmin: testPayload.forceAdmin
  });

  try {
    // Sign the new JWT token
    const newToken = await signJWT(testPayload);

    // Store it in localStorage
    localStorage.setItem('jwt', newToken);

    console.log('✅ Test token created and stored!');
    console.log('New user:', `${testPayload.testFirstname} ${testPayload.testLastname} (${testPayload.testEmail})`);
    console.log('Role:', testPayload.forceAdmin ? 'Admin' : 'User');
    console.log('');
    console.log('🔄 Please refresh the page or reconnect to see the changes.');

    return true;
  } catch (error) {
    console.error('Error creating test token:', error);
    return false;
  }
}

/**
 * Switch to admin mode
 */
async function becomeAdmin() {
  console.log('🔄 Switching to admin mode...');
  const success = await createAndStoreTestToken('admin');
  if (success) {
    console.log('👑 You are now an admin! Refresh the page to see changes.');
  }
  return success;
}

/**
 * Switch to user mode
 */
async function becomeUser(userId = '1') {
  console.log(`🔄 Switching to user mode (User${userId})...`);
  const success = await createAndStoreTestToken('user', userId);
  if (success) {
    console.log(`👤 You are now User${userId}! Refresh the page to see changes.`);
  }
  return success;
}

/**
 * Reset to normal mode (remove test flags)
 */
async function resetToNormal() {
  const currentToken = getCurrentToken();
  if (!currentToken) {
    console.error('No current JWT token found.');
    return false;
  }

  const originalPayload = decodeJWT(currentToken);
  if (!originalPayload) {
    console.error('Cannot decode current JWT token');
    return false;
  }

  // Remove test mode flags
  const normalPayload = { ...originalPayload };
  delete normalPayload.testMode;
  delete normalPayload.testEmail;
  delete normalPayload.testFirstname;
  delete normalPayload.testLastname;
  delete normalPayload.forceAdmin;

  try {
    // Sign the normal JWT token
    const normalToken = await signJWT(normalPayload);

    // Store it in localStorage
    localStorage.setItem('jwt', normalToken);

    console.log('✅ Reset to normal mode!');
    console.log('User:', `${normalPayload.firstname} ${normalPayload.lastname} (${normalPayload.email})`);
    console.log('🔄 Please refresh the page to see changes.');

    return true;
  } catch (error) {
    console.error('Error resetting to normal mode:', error);
    return false;
  }
}

/**
 * Show current user status
 */
function whoAmI() {
  const user = getCurrentUser();
  if (!user) {
    console.log('No user authenticated');
    return;
  }

  if (user.mode === 'test') {
    console.log('=== TEST MODE ===');
    console.log('Test User:', user.test);
    console.log('Original User:', user.original);
  } else {
    console.log('=== NORMAL MODE ===');
    console.log('User:', user);
  }
}

/**
 * Force frontend to reconnect (trigger authentication with new token)
 */
function forceReconnect() {
  console.log('🔄 Forcing reconnection...');

  // Trigger a storage event to notify other tabs/windows
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'jwt',
    newValue: localStorage.getItem('jwt'),
    url: window.location.href
  }));

  // If there's a socket connection, try to trigger reconnection
  if (window.io && window.io.sockets) {
    console.log('Disconnecting socket to force reconnection...');
    window.io.sockets.disconnect();
    setTimeout(() => {
      window.io.sockets.connect();
    }, 100);
  }

  console.log('If changes are not visible, please refresh the page manually.');
}

/**
 * Quick user switcher with automatic reconnection
 */
async function quickSwitch(userType, userId = '1') {
  let success = false;

  if (userType === 'admin') {
    success = await becomeAdmin();
  } else if (userType === 'user') {
    success = await becomeUser(userId);
  } else if (userType === 'normal') {
    success = await resetToNormal();
  }

  if (success) {
    // Small delay to ensure token is stored
    setTimeout(() => {
      forceReconnect();
    }, 100);
  }

  return success;
}

// Export functions for console use
window.pollTestUtils = {
  getCurrentUser,
  getCurrentToken,
  whoAmI,
  becomeAdmin,
  becomeUser,
  resetToNormal,
  decodeJWT,
  forceReconnect,
  quickSwitch,
  // Legacy aliases for backward compatibility
  admin: () => quickSwitch('admin'),
  user: (id) => quickSwitch('user', id),
  normal: () => quickSwitch('normal')
};

console.log('🧪 Poll Test Utils loaded!');
console.log('Available functions:');
console.log('- whoAmI() - Show current user info');
console.log('- becomeAdmin() - Switch to admin mode');
console.log('- becomeUser(id) - Switch to user mode');
console.log('- resetToNormal() - Reset to original user');
console.log('- quickSwitch(type, id) - Quick switch with auto-reconnect');
console.log('- forceReconnect() - Force socket reconnection');
console.log('');
console.log('🚀 Quick commands:');
console.log('- pollTestUtils.admin() - Become admin');
console.log('- pollTestUtils.user(2) - Become user 2');
console.log('- pollTestUtils.normal() - Reset to normal');
console.log('');
console.log('Example usage:');
console.log('pollTestUtils.whoAmI()');
console.log('pollTestUtils.admin()');
console.log('pollTestUtils.user(3)');
