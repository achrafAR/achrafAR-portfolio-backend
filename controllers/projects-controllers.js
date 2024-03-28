import Project from "../models/projects-models.js";
// import cloudinary from "../middleware/cloudinaryUploads.js";
import { v2 as cloudinary } from "cloudinary";



cloudinary.config({
    cloud_name: "dgrxxadxo",
    api_key: "615318325455165",
    api_secret: "MiXnwEaqTGZTf32WtRXlsQ-6iZc",
});

const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find();
    res.json({
      message: "All Projects",
      status: 200,
      data: allProjects || [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

const createProjects = async (req, res) => {
  try {
    const { name, description, link } = req.body;
    let image = req.file.path;
    const uploadedImage = await cloudinary.uploader.upload(image); // upload the image to cloudinary

    // Create new project with image URL
    const newProject = new Project({
      name,
      description,
      link,
      image: uploadedImage.secure_url,
    });

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
      error: error.message,
    });
  }
};
// get project by Id
const getProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      // Find the project by ID from the database
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
          status: 404,
        });
      }
      res.json({
        message: "Project found",
        status: 200,
        data: project,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: error.message,
      });
    }
  };
// update project by Id
const updateProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, link } = req.body;
      let image;
  
      // Check if a new image is uploaded
      if (req.file) {
        image = req.file.path;
        // Upload the new image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image);
        // Assign the secure URL of the uploaded image to the image variable
        image = uploadedImage.secure_url;
      }
  
      // Find the project by ID from the database
      let project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
          status: 404,
        });
      }
  
      // Update project properties
      project.name = name;
      project.description = description;
      project.link = link;
      if (image) {
        // Update image URL if a new image is uploaded
        project.image = image;
      }
  
      // Save the updated project to the database
      project = await project.save();
      
      res.json({
        message: "Project updated successfully",
        status: 200,
        data: project,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: error.message,
      });
    }
  };
// delete projects by id
const deleteProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      // Find the project by ID and delete it from the database
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        return res.status(404).json({
          message: "Project not found",
          status: 404,
        });
      }
      res.json({
        message: "Project deleted successfully",
        status: 200,
        data: deletedProject,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: error.message,
      });
    }
  };



export { getAllProjects, createProjects, deleteProjectById ,getProjectById, updateProjectById};
