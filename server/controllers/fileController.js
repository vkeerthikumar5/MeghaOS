import File from '../models/File.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { parentId } = req.body;
    const file = new File({
      name: req.file.originalname,
      type: getFileType(req.file.originalname),
      parentId: parentId === 'null' || !parentId ? null : parentId,
      serverPath: `/uploads/${req.file.filename}`,
      size: req.file.size,
      owner: req.userId
    });

    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.doc', '.docx'].includes(ext)) return 'word';
  if (['.xls', '.xlsx'].includes(ext)) return 'excel';
  if (['.ppt', '.pptx'].includes(ext)) return 'powerpoint';
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return 'image';
  if (ext === '.pdf') return 'pdf';
  if (['.txt', '.md'].includes(ext)) return 'notepad';
  if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) return 'audio';
  return 'file';
};

export const getFiles = async (req, res) => {
  try {
    const { parentId } = req.params;
    const query = parentId === 'null' || !parentId 
      ? { parentId: null, owner: req.userId } 
      : { parentId, owner: req.userId };
    const files = await File.find(query);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, type, parentId } = req.body;
    
    let serverPath = '';
    if (type !== 'folder' && type !== 'drive' && type !== 'notepad') {
      const ext = type === 'word' ? 'docx' : type === 'excel' ? 'xlsx' : 'pptx';
      const fileName = `${Date.now()}_${name}.${ext}`;
      serverPath = `/uploads/${fileName}`;
      const fullPath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(fullPath, ''); 
    }

    let finalName = name;
    if (type === 'notepad' && !name.toLowerCase().endsWith('.txt')) {
      finalName = `${name}.txt`;
    }

    const file = new File({
      name: finalName,
      type,
      parentId: parentId === 'null' ? null : parentId,
      serverPath,
      content: type === 'notepad' ? '' : undefined,
      owner: req.userId
    });
    
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, owner: req.userId });
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });

    if (file.serverPath) {
      const fullPath = path.join(UPLOADS_DIR, path.basename(file.serverPath));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await File.deleteOne({ _id: id });
    // Recursively delete children if it's a folder
    if (file.type === 'folder') {
      await File.deleteMany({ parentId: id, owner: req.userId });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const moveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { parentId } = req.body;
    
    const file = await File.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { parentId: parentId === 'null' ? null : parentId },
      { new: true }
    );
    
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });
    
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOnlyOfficeConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, owner: req.userId });
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });

    const config = {
      document: {
        fileType: file.type === 'word' ? 'docx' : file.type === 'excel' ? 'xlsx' : 'pptx',
        key: file._id.toString(),
        title: file.name,
        url: `${req.protocol}://${req.get('host')}${file.serverPath}`
      },
      editorConfig: {
        callbackUrl: `${req.protocol}://${req.get('host')}/api/files/${file._id}/save`
      }
    };
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveOnlyOfficeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    
    // OnlyOffice sends a POST request to this callbackUrl with status and download link
    // Status 2 or 6 means the document is ready to be saved
    if (req.body.status === 2 || req.body.status === 6) {
      const downloadUrl = req.body.url;
      // In a real implementation: download the file and overwrite the local copy
      // console.log(`Downloading file from: ${downloadUrl}`);
    }
    
    res.json({ error: 0 }); // OnlyOffice expects { error: 0 } on success
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renameItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const file = await File.findOneAndUpdate(
      { _id: id, owner: req.userId }, 
      { name }, 
      { new: true }
    );
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });
    
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const file = await File.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { content },
      { new: true }
    );
    
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });
    
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, owner: req.userId });
    if (!file) return res.status(404).json({ error: 'File not found or access denied' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAudioFiles = async (req, res) => {
  try {
    const files = await File.find({ type: 'audio', owner: req.userId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
