import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, verifyPassword, generateToken, assignRole } from '../services/authService.js';
import { createUser, getUserByEmail, updateUser } from '../services/userStorage.js';
import { validateEmail, validatePassword, validateUsername, checkValidation } from '../middleware/validation.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { UserResponse } from '../types/user.js';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post(
  '/signup',
  [
    validateEmail,
    validateUsername,
    validatePassword,
    checkValidation,
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      // Check for duplicate email
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Determine role (admin if first user, user otherwise)
      const role = await assignRole();

      // Create user record
      const now = new Date().toISOString();
      const userId = uuidv4();

      const user = await createUser({
        id: userId,
        email: email.toLowerCase(),
        username: username.trim(),
        passwordHash,
        role,
        createdAt: now,
        lastLogin: null,
        characters: [],
      });

      // Generate token
      const token = generateToken(user);

      // Return user data (without password) and token
      const { passwordHash: _, ...userResponse } = user;
      res.status(201).json({
        user: userResponse as UserResponse,
        token,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
);

/**
 * POST /api/auth/signin
 * Authenticate user and return token
 */
router.post(
  '/signin',
  [
    validateEmail,
    body('password').notEmpty().withMessage('Password is required'),
    checkValidation,
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      const now = new Date().toISOString();
      await updateUser(user.id, { lastLogin: now });

      // Generate token
      const token = generateToken(user);

      // Return user data (without password) and token
      const { passwordHash: _, ...userResponse } = user;
      res.json({
        user: userResponse as UserResponse,
        token,
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  }
);

/**
 * POST /api/auth/signout
 * Sign out (client-side token removal)
 */
router.post('/signout', authenticateToken, requireAuth, (req: Request, res: Response) => {
  // Token removal is handled client-side
  // This endpoint just confirms the request
  res.json({ message: 'Signed out successfully' });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateToken, requireAuth, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { passwordHash: _, ...userResponse } = req.user;
  res.json(userResponse as UserResponse);
});

export default router;

