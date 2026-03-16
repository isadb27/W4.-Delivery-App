import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  authenticateUserService,
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from './auth.service';
import { UserRole } from './auth.types';

export const getUsersController = async (req: Request, res: Response) => {
  const users = await getUsersService();
  return res.json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserByIdService(String(id));
  return res.json(user);
};

export const authenticateUserController = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  const user = await authenticateUserService({ email, password });
  return res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { id } = req.params;
  const { name, address } = req.body;

  const user = await updateUserService({
    id: String(id),
    name,
    address,
  });
  return res.json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password, role } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  if (!Object.values(UserRole).includes(role)) {
    throw Boom.badRequest(
      `Role must be one of: ${Object.values(UserRole).join(', ')}`
    );
  }

  const user = await createUserService({ email, password, role });
  return res.status(201).json(user);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUserService(String(id));
  return res.send('User deleted');
};
