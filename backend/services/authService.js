// Handles Authentication Logic
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const createJWTToken = (user) => {
  return jwt.sign({ userId: user.UserId, email: user.Email }, SECRET_KEY, { expiresIn: '1h' });
};
