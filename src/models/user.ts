import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IUserInput {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin' | 'manager' | 'super user'
  isActive?: boolean
  cart: Types.ObjectId
  orders: Types.ObjectId
}

export interface IUser extends Document, IUserInput {
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'manager', 'super user'], default: 'user' },
    isActive: { type: Boolean, default: true },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
)

const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)

export default User
