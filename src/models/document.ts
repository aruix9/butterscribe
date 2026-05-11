import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IDocumentInput {
  title: string
  body: string
  userId: Types.ObjectId
  status: 'draft' | 'published' | 'archived' | 'approved' | 'changes_requested'
}

export interface IDocument extends Document, IDocumentInput {
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived', 'approved', 'changes_requested'], default: 'draft' },
  },
  { timestamps: true }
)

const DocumentModel = (models.Document as Model<IDocument>) || model<IDocument>('Document', DocumentSchema)

export default DocumentModel
