import express from 'express';
import { getAllProjects, createProjects, deleteProjectById, getProjectById, updateProjectById } from '../controllers/projects-controllers.js';
import upload from '../middleware/uploadMulter.js'

const router = express.Router();


// Route to get all projects
router.get('/', getAllProjects);

// Route ti get projects By Id
router.get('/:id',getProjectById)
// Route to create a new project
router.post('/', upload.single('image'), createProjects);

// Route to delete Project By Id
router.delete('/:id',deleteProjectById)
// Route to update Project By Id
router.patch('/:id', upload.single('image'), updateProjectById); // Route to update projects by ID (using PUT method)
export default router;