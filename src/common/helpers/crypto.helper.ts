import bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  saltRounds?: number,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

export async function validatePassword(
  hashedPassword: string,
  password: string,
) {
  return bcrypt.compare(password, hashedPassword);
}
