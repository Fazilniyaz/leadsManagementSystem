import { Response } from 'express'

export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict', // ← 'none' for cross-origin
    maxAge: 15 * 60 * 1000,
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict', // ← 'none' for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const clearTokenCookies = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  res.cookie('accessToken', '', { 
    maxAge: 0, 
    sameSite: isProduction ? 'none' : 'strict',
    secure: isProduction,
    httpOnly: true,
  })
  res.cookie('refreshToken', '', { 
    maxAge: 0,
    sameSite: isProduction ? 'none' : 'strict',
    secure: isProduction,
    httpOnly: true,
  })
}