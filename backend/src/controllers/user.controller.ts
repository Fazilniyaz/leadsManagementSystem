import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

const PAGE_LIMIT = 10;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const skip = (page - 1) * PAGE_LIMIT;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(PAGE_LIMIT).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / PAGE_LIMIT),
          hasNextPage: page < Math.ceil(total / PAGE_LIMIT),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.body;

    if (!['admin', 'sales'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role' });
      return;
    }

    // Admin cannot change own role
    if (req.params.id === req.user?.id) {
      res.status(400).json({ success: false, message: 'Cannot change your own role' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User role updated',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};