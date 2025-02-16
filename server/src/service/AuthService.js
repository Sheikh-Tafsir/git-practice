import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import User from '../model/User';
import { RuntimeError } from '../utils/Utils.js';

const saltRounds = 10;

dotenv.config();

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

const USER_DOES_NOT_EXIST = 'User with this email does not exist';

const INCORRECT_PASSWORD = "Password incorrect";

const REFRESH_TOKEN_EXPIRED = "Invalid or expired refresh token";

export const save = async (reqBody) => {
  const transaction = await Database.transaction();

  try {
    const userInstance = User.build(reqBody);
    await userInstance.validate();

    const { email, password, ...rest } = reqBody;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new RuntimeError(422, 'User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create(
        {
          email,
          password: hashedPassword,
          ...rest,
        },
        { transaction }
    );

    await transaction.commit();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
  
    return { accessToken, refreshToken };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const login = async (req) => {
    const userInstance = User.build(req);
    await userInstance.validate({
        fields: ['email', 'password']
    });

    const { email, password,} = req;
    
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new RuntimeError(422, USER_DOES_NOT_EXIST);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      throw new RuntimeError(422, INCORRECT_PASSWORD);
    }

    const user = {
      id: existingUser.id,
      name: existingUser.name,
      roleId: existingUser.roleId,
    };

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

  
    return { accessToken, refreshToken };
};

export const googleLogin = async (req) => {
  const userInstance = User.build(req);
  await userInstance.validate({
      fields: ['email']
  });

  const { email } = req;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    throw new RuntimeError(422, USER_DOES_NOT_EXIST);
  }

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    roleId: existingUser.roleId,
  };

  const refreshToken = generateRefreshToken(user);

  // user.image = existingUser.image;
  const accessToken = generateAccessToken(user);

  return { accessToken, refreshToken };
};

export const refreshAcessToken = async (refreshToken) => {
    if (!refreshToken) {
      throw RuntimeError(401, REFRESH_TOKEN_EXPIRED);
    }

    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
    const { iat, ...userWithoutIat } = user;

    const accessToken = generateAccessToken(userWithoutIat);
    return accessToken;
}

const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d', noTimestamp: true });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET_KEY);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email },
  });
};