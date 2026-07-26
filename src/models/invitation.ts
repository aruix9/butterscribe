import { Document, model, Model, models, Schema, Types } from 'mongoose';

export interface IInvitationInput {
  email: string;
  clientId: Types.ObjectId;
  token: string;
  role?: string;
  status?: 'pending' | 'accepted' | 'expired';
  invitedBy?: Types.ObjectId;
  expiresAt?: Date;
}

export interface IInvitation extends Document, IInvitationInput {
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    token: { type: String, required: true, unique: true, index: true },
    role: { type: String, default: 'user' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending',
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

if (models.Invitation) {
  delete (models as any).Invitation;
}

const Invitation =
  (models.Invitation as Model<IInvitation>) ||
  model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
