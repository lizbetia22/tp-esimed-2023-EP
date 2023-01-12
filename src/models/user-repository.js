const { users } = require('./db');
const uuid = require('uuid');
const md5 = require('md5');
const { User } = require('../models/user.model.js');

exports.getUsers = async () => await  findAll(User);

exports.getUserByFirstName =  (firstName) => {
  return  User.find((user) => user.firstName == firstName);
};

exports.createUser = async (body) => {
  const hashedPassword = md5(body.password);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  await User.create(user);
};

exports.updateUser =  (id, data)  => {
  const foundUser = User.find((user) => user.id == id);

  if (!foundUser) {
    throw new Error('User not found');
  }

  foundUser.firstName = data.firstName || foundUser.firstName;
  foundUser.lastName = data.lastName || foundUser.lastName;
  foundUser.password = data.password ? md5(data.password) : foundUser.password;
};

exports.deleteUser = async (id) => {
  const userIndex = User.findIndex((user) => user.id == id);

  if (userIndex === -1) {
    throw new Error('User not foud');
  }

  await User.destroy(userIndex, 1);
}
