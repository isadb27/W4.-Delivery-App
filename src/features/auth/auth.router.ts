import { Router } from 'express';
import {
  authenticateUserController,
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUser,
} from './auth.controller';

export const router = Router();
router.get('/', getUsersController);
router.post('/login', authenticateUserController);
router.post('/register', createUserController);
router.get('/:id', getUserByIdController);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUserController);
