import { Document, model, Model, models, Schema, Types } from 'mongoose'

export interface IAiGenerationInput {
  title: string
  prompt: string
  response: string
  userId: Types.ObjectId
  documentId?: Types.ObjectId
}

export interface IAiGeneration extends Document, IAiGenerationInput {
  createdAt: Date
  updatedAt: Date
}

const AiGenerationSchema = new Schema<IAiGeneration>(
  {
    title: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    response: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    documentId: { type: Schema.Types.ObjectId, ref: 'Document' },
  },
  { timestamps: true }
)

const AiGenerationModel = (models.AiGeneration as Model<IAiGeneration>) || model<IAiGeneration>('AiGeneration', AiGenerationSchema)

export default AiGenerationModel
