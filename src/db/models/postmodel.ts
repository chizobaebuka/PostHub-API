import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import UserModel from "./usermodel";

class PostModel extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public userId!: string;
  public createdAt!: Date; // Add createdAt and updatedAt types
  public updatedAt!: Date;
}

PostModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel, // Reference to User model
        key: 'id',
      },
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
  },
  {
    sequelize,
    modelName: 'PostModel',
    tableName: 'posts',
    timestamps: true, // This ensures createdAt and updatedAt are managed automatically
  }
);

export default PostModel;
