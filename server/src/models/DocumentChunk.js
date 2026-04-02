import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      default: 'general',
      trim: true,
      lowercase: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'Embedding must contain numeric values',
      },
    },
    metadata: {
      sourceType: {
        type: String,
        default: 'upload',
      },
      wordCount: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

documentChunkSchema.index({ subject: 1, topic: 1 });

documentChunkSchema.index({ fileName: 1, chunkIndex: 1 }, { unique: true });

const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);

export default DocumentChunk;
