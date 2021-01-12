'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize from 'sequelize';
const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const { database } = require('../../config/' + env);
const db = {};

let sequelize;
if (database.use_env_variable) {
  sequelize = new Sequelize(process.env[database.use_env_variable], database);
} else {
  sequelize = new Sequelize(database.name, database.username, database.password, database);
}

readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
