import {
  AuthenticateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from './auth.types';
import Boom from '@hapi/boom';
import { pool } from '../../config/database';

export const getUsersService = async (): Promise<User[]> => {
  const dbRequest = await pool.query('SELECT * FROM users');
  return dbRequest.rows;
};

export const getUserByIdService = async (userId: string): Promise<User> => {
  const dbRequest = await pool.query('SELECT * FROM users WHERE id = $1', [
    userId,
  ]);

  if (dbRequest.rowCount === 0) {
    throw Boom.notFound('User not found');
  }

  return dbRequest.rows[0];
};

export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
): Promise<User> => {
  const dbRequest = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [credentials.email, credentials.password]
  );

  if (dbRequest.rowCount === 0) {
    throw Boom.unauthorized('Invalid credentials');
  }

  return dbRequest.rows[0];
};

export const updateUserService = async (user: UpdateUserDTO): Promise<User> => {
  const userFound = await getUserByIdService(user.id);

  const name = user.name === undefined ? userFound.name : user.name;
  const address = user.address === undefined ? userFound.address : user.address;

  const dbRequest = await pool.query(
    'UPDATE users SET name = $1, address = $2 WHERE id = $3 RETURNING *',
    [name, address, user.id]
  );

  return dbRequest.rows[0];
};

export const deleteUserService = async (userId: string): Promise<void> => {
  const userFound = await getUserByIdService(userId);
  await pool.query('DELETE FROM users WHERE id = $1', [userFound.id]);
};

export const createUserService = async (user: CreateUserDTO): Promise<User> => {
  const dbRequest = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
    [user.email, user.password, user.role]
  );

  return dbRequest.rows[0];
};
