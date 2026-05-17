import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../helpers/jwt.helper';
import { setTokenCookies, clearTokenCookies } from '../helpers/cookie.helper';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already exists' });
      return;
    }

    const userCount = await User.countDocuments()

const user = await User.create({
  name,
  email,
  password,
  role: userCount === 0 ? 'admin' : 'sales', // ← First user = admin, rest = sales
})


    // const accessToken = generateAccessToken({
    //   id: user._id.toString(),
    //   role: user.role,
    // });
    // const refreshToken = generateRefreshToken({
    //   id: user._id.toString(),
    //   role: user.role,
    // });

    // setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  clearTokenCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }
    
    // Fresh access token குடு
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    })
    
    res.status(200).json({ 
      success: true, 
      data: { accessToken, user } 
    })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};