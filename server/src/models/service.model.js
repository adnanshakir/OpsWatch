import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'database', 'infra'],
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    environment: {
      type: String,
      enum: ['production', 'staging', 'dev'],
      default: 'production',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Optional metadata
    repoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique index per workspace + name
serviceSchema.index({ workspace: 1, name: 1 }, { unique: true });

export const Service = mongoose.model('Service', serviceSchema);
