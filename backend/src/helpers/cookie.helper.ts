import { Response } from 'express'

// Cross-origin if CLIENT_URL is an https:// address (i.e. deployed, not localhost)
const isCrossOrigin = (): boolean => {
  const clientUrl = process.env.CLIENT_URL ?? ''
  return clientUrl.startsWith('https://')
}

export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const crossOrigin = isCrossOrigin()

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: crossOrigin,
    sameSite: crossOrigin ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: crossOrigin,
    sameSite: crossOrigin ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const clearTokenCookies = (res: Response): void => {
  const crossOrigin = isCrossOrigin()

  res.cookie('accessToken', '', {
    maxAge: 0,
    sameSite: crossOrigin ? 'none' : 'lax',
    secure: crossOrigin,
    httpOnly: true,
  })
  res.cookie('refreshToken', '', {
    maxAge: 0,
    sameSite: crossOrigin ? 'none' : 'lax',
    secure: crossOrigin,
    httpOnly: true,
  })
}