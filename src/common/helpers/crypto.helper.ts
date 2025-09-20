import bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  saltRounds?: number,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

export async function validatePassword(
  password: string,
  hashedPassword: string,
) {
  return bcrypt.compare(password, hashedPassword);
}
