import User from '../model/User';
import Database from "../config/DatabaseConfig";
import { pageCount, paginationSize } from '../utils/Utils';

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email", "updatedAt"],
  });
};

export const getAllPaginatedUsers = async (page) => {
  const offset = paginationSize * (page-1);

  const { count: totalCount, rows: data } = await User.findAndCountAll({
    attributes: ["id", "name", "designation", "updatedAt"],
    limit: paginationSize,
    offset: offset,
    order: [["name", "ASC"]], 
  });

  return {
    data,
    totalCount: pageCount(totalCount),
  }
};

export const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const editUser = async (id, req) => {
  const transaction = await Database.transaction();

  try {
    const userValidation = User.build(req);
    await userValidation.validate({
      fields: ['name', 'phone', 'image']
    });

    const user = await getUserById(id);

    for (const key in req) {
      if (user[key] !== req[key]) {
        user[key] = req[key];
      }
    }

    await user.save({transaction})
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteUser = async (id) => {
  const transaction = await Database.transaction();

  try {
    await User.update(
        { deleted: true },
        {
          where: { id },
          transaction
        }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};