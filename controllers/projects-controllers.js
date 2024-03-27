import Project from '../models/projects-models.js';
import cloudinary from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllProjects = async (req, res) => {
    try {
        const allProjects = await Project.find();
        res.json({
            message: "All Projects",
            status: 200,
            data: allProjects,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
            error: error.message
        });
    }
};

const createProjects = async (req, res) => {
    try {
        const { name, description, link } = req.body;
        let image;
        
        // Check if an image is uploaded
        if (req.file) {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            // Get the image URL from Cloudinary response
            image = result.secure_url;
        }
        
        // Create new project with image URL
        const newProject = new Project({ name, description, link, image });
        
        // Save the project to the database
        await newProject.save();

        res.status(201).json({
            message: "Project created successfully",
            status: 201,
            data: newProject,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
            error: error.message
        });
    }
};
// get project by Id
// update project by Id
// delete projects


export { getAllProjects, createProjects };
