import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IDocumentInput {
  title: string
  description?: string
  body?: string
  aiGenerationId?: Types.ObjectId

  userId: Types.ObjectId
  clientId?: Types.ObjectId
  status: 'draft' | 'pending_approval' | 'in_review' | 'changes_requested' | 'approved' | 'published' | 'archived'
  startDate?: Date
  endDate?: Date
}

export interface IDocument extends Document, IDocumentInput {
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    body: { type: String, default: '' },
    aiGenerationId: { type: Schema.Types.ObjectId, ref: 'AiGeneration' },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    status: { 
      type: String, 
      enum: ['draft', 'pending_approval', 'in_review', 'changes_requested', 'approved', 'published', 'archived'], 
      default: 'draft' 
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
)

if (models.Document && !models.Document.schema.path('clientId')) {
  delete (models as any).Document;
}

const DocumentModel = (models.Document as Model<IDocument>) || model<IDocument>('Document', DocumentSchema)

export default DocumentModel
