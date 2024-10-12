import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";


class UserModel extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public country!: string;
  public email!: string;
  public password!: string;
  public postId!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow null in case a user doesn't have a post associated
    references: {
      model: 'posts', // Reference to the 'posts' table
      key: 'id',      // The key in the posts table that postId references
    },
    onUpdate: 'CASCADE', // Update postId if the referenced post's id changes
    onDelete: 'SET NULL', // Set postId to null if the referenced post is deleted
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  sequelize: sequelize,
  modelName: 'UserModel',
  tableName: 'users',
});

export default UserModel;
