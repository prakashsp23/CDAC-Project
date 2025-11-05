export function validatePassword(password, username, email) {
  const errors = [];

  // 1. Length Check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password.length > 20) {
    errors.push('Password cannot be longer than 20 characters');
  }

  // 2. Character Types Check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must include at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  // 3. Space Check
  if (/\s/.test(password)) {
    errors.push('Password cannot contain spaces');
  }

  // 4. Username/Email Check
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('Password cannot contain your username');
  }
  if (email) {
    const emailPrefix = email.split('@')[0];
    if (password.toLowerCase().includes(emailPrefix.toLowerCase())) {
      errors.push('Password cannot contain your email address');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}