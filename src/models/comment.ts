import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IComment extends Document {
  documentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  text: string;
  selection?: string; // The selected text context
  parentId?: mongoose.Types.ObjectId; // For one level of nesting
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    text: { type: String, required: true },
    selection: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

const Comment = (models.Comment as Model<IComment>) || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
