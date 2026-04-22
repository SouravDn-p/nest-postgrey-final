import { CookieOptions } from 'express';

export const ACCESS_MAX_AGE = 15 * 60 * 1000; // 15 minutes
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const buildCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge,
  path: '/',
});
