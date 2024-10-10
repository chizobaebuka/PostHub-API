import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import UserModel from "./usermodel";

class CommentModel extends Model {
  public id!: string;         // Corrected type to match UUID
  public content!: string;
  public userId!: string;     // Corrected type to match UUID
  public postId!: string;     // Assuming postId should also be UUID
  public createdAt!: Date;     
  public updatedAt!: Date;     
}

CommentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    postId: { // Added postId definition
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts', // Assuming a posts table exists
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
    modelName: 'CommentModel',
    tableName: 'comments',
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default CommentModel;
