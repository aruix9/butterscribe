import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IUserInput {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin' | 'manager' | 'super user'
  isActive?: boolean
  isVerified?: boolean
  cart?: Types.ObjectId
  orders?: Types.ObjectId
  clientId?: Types.ObjectId
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
    isVerified: { type: Boolean, default: true },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  },
  { timestamps: true }
)

if (models.User && !models.User.schema.path('clientId')) {
  delete (models as any).User;
}

const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)

export default User
