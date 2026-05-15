export type PasswordStrength = {
  level: 0 | 1 | 2 | 3 | 4;
  message: string;
};

const MESSAGES: Record<number, string> = {
  0: 'Use 8+ characters with a mix of letters, numbers & symbols.',
  1: 'Weak — keep going.',
  2: 'Fair — add numbers or symbols.',
  3: 'Good — almost there.',
  4: 'Strong password ✓'
};

export const scorePassword = (pw: string): PasswordStrength => {
  if (!pw) return { level: 0, message: MESSAGES[0] };

  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;

  const level = Math.max(1, s) as 1 | 2 | 3 | 4;
  return { level, message: MESSAGES[level] };
};
