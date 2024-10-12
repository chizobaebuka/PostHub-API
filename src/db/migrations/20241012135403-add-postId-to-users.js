'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('users', 'postId', {
      type: DataTypes.UUID,
      allowNull: true, // Set to true or false based on your requirements
      references: {
        model: 'posts', // Name of the posts table
        key: 'id',
      },
      onUpdate: 'CASCADE', // Optional, specify what happens on updates
      onDelete: 'SET NULL', // Optional, specify what happens on deletes
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'postId');
  }
};
