// import Project from "../models/projectSchema.js";

// export const createProject = async (req, res) => {
//   const { name, team, members } = req.body;
//   console.log(name, team, members);
//   try {
//     const project = new Project({ name, team, members });
//     await project.save();
//     res.json({ success: true, message: "Project created", project });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getProjects = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5;
//   const startIndex = (page - 1) * limit;
//   const search = req.query.search || "";
//   const sort = req.query.sort || "name";
//   try {
//     const projects = await Project.find({
//       members: req.user.id,
//       name: new RegExp(search, "i"),
//     })
//       .sort(sort)
//       .skip(startIndex)
//       .limit(limit)
//       .populate("team", "name")
//       .populate("members", "email")
//       .exec();
//     res.json(projects);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateProject = async (req, res) => {
//   const { id } = req.params;
//   const { name, team, members } = req.body;
//   try {
//     const project = await Project.findByIdAndUpdate(
//       id,
//       { name, team, members },
//       { new: true }
//     );
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     res.json({ success: true, message: "Project updated", project });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const deleteProject = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const project = await Project.findByIdAndDelete(id);
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     res.json({ success: true, message: "Project deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

import Project from '../models/projectSchema.js';
import Team from '../models/teamSchema.js';

export const createProject = async (req, res) => {
  try {
    const { name, team: teamId } = req.body;
    const team = await Team.findOne({ _id: teamId, 'members.user': req.user._id, 'members.role': 'Admin' });
    if (!team) return res.status(403).send({ message: 'Unauthorized' });

    const project = new Project({ name, team: teamId, members: [req.user._id], createdBy: req.user._id });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, members } = req.body;
    const project = await Project.findOne({ _id: id, createdBy: req.user._id });
    if (!project) return res.status(403).send({ message: 'Unauthorized' });

    project.name = name || project.name;
    project.members = members || project.members;
    await project.save();
    res.send(project);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!project) return res.status(403).send({ message: 'Unauthorized' });
    res.send({ message: 'Project deleted' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 5, search } = req.query;
    const query = { members: req.user._id };
    if (search) query.name = { $regex: search, $options: 'i' };
    const projects = await Project.find(query)
      .populate('team')
      .limit(limit)
      .skip((page - 1) * limit);
    const total = await Project.countDocuments(query);
    res.send({ data: projects, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};