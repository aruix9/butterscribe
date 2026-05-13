import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IDocumentInput {
  title: string
  description?: string
  body?: string

  userId: Types.ObjectId
  status: 'draft' | 'published' | 'archived' | 'approved' | 'changes_requested'
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

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived', 'approved', 'changes_requested'], default: 'draft' },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
)


const DocumentModel = (models.Document as Model<IDocument>) || model<IDocument>('Document', DocumentSchema)

export default DocumentModel
