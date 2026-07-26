import { Document, model, Model, models, Schema, Types } from 'mongoose';

export interface IClientInput {
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  status?: 'active' | 'inactive' | 'disabled';
  notes?: string;
  systemPrompt?: string;
  users?: Types.ObjectId[];
}

export interface IClient extends Document, IClientInput {
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled'],
      default: 'active'
    },
    notes: { type: String, trim: true, default: "" },
    systemPrompt: { type: String, trim: true, default: "" },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

if (models.Client && (!models.Client.schema.path('systemPrompt') || !models.Client.schema.path('users'))) {
  delete (models as any).Client;
}

const Client = (models.Client as Model<IClient>) || model<IClient>('Client', ClientSchema);

export default Client;
