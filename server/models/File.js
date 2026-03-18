import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['folder', 'word', 'excel', 'powerpoint', 'drive', 'notepad', 'image', 'pdf', 'audio'], 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'File',
    default: null 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Optional for now
  },
  serverPath: { type: String }, // Path to disk storage (/uploads/...)
  content: { type: String },    // For tiny text-based files if needed
  size: { type: Number, default: 0 },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
export default File;
