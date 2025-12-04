import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { getAllUsers, getUserById, updateUser } from '../services/userStorage.js';
import { authenticateToken, requireAuth, requireAdmin } from '../middleware/auth.js';
import { checkValidation } from '../middleware/validation.js';
import { UserRole } from '../types/user.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAuth);
router.use(requireAdmin);

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

/**
 * PUT /api/users/:id
 * Update user (admin only, can change roles)
 */
router.put(
  '/:id',
  [
    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('username').optional().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
    body('role').optional().isIn(['user', 'administrator', 'gamemaster']).withMessage('Invalid role'),
    checkValidation,
  ],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates: { email?: string; username?: string; role?: UserRole } = {};

      if (req.body.email) {
        updates.email = req.body.email.toLowerCase();
      }
      if (req.body.username) {
        updates.username = req.body.username.trim();
      }
      if (req.body.role) {
        updates.role = req.body.role as UserRole;
      }

      const user = await getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent admin from removing their own admin role if they're the only admin
      if (updates.role && updates.role !== 'administrator' && user.role === 'administrator') {
        const allUsers = await getAllUsers();
        const adminCount = allUsers.filter(u => u.role === 'administrator').length;
        if (adminCount === 1 && user.id === id) {
          return res.status(400).json({ error: 'Cannot remove the last administrator' });
        }
      }

      const updatedUser = await updateUser(id, updates);
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user' });
      }

      const { passwordHash: _, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

export default router;

