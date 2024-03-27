import express from 'express';
import { getAllProjects, createProjects } from '../controllers/projects-controller.js';
import multer from 'multer';

const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Route to get all projects
router.get('/projects', getAllProjects);

// Route to create a new project
router.post('/projects', upload.single('image'), createProjects);

export default router;