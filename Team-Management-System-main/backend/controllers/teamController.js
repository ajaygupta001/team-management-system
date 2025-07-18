// import Team from "../models/teamSchema.js";

// export const createTeam = async (req, res) => {
//   const { name } = req.body;
//   try {
//     const user = req.user;
//     if (user.teams.length >= 5) return res.status(400).send({ message: 'Max 5 teams limit reached' });
//     const team = new Team({ name, members, admin: req.user.id });
//     await team.save();
//     res.json({ success: true, message: "Team created", team });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getTeams = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5;
//   const startIndex = (page - 1) * limit;
//   const search = req.query.search || "";
//   const sort = req.query.sort || "name";
//   try {
//     const teams = await Team.find({
//       admin: req.user.id,
//       name: new RegExp(search, "i"),
//     })
//       .sort(sort)
//       .skip(startIndex)
//       .limit(limit)
//       .populate("members", "email")
//       .populate("admin", "email")
//       .exec();
//     res.json(teams);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateTeam = async (req, res) => {
//   const { id } = req.params;
//   const { name, members } = req.body;
//   try {
//     const team = await Team.findOneAndUpdate(
//       { _id: id, admin: req.user.id },
//       { name, members },
//       { new: true }
//     );
//     if (!team) return res.status(404).json({ message: "Team not found" });
//     res.json({ success: true, message: "Team updated", team });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const deleteTeam = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const team = await Team.findOneAndDelete({ _id: id, admin: req.user.id });
//     if (!team) return res.status(404).json({ message: "Team not found" });
//     res.json({ success: true, message: "Team deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

import User from "../models/userSchema.js";
import Team from "../models/teamSchema.js";

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;
    if (user.teams.length >= 20)
      return res.status(400).send({ message: "Max 5 teams limit reached" });

    const team = new Team({
      name,
      members: [{ user: user._id, role: "Admin" }],
      createdBy: user._id,
    });
    await team.save();
    user.teams.push(team._id);
    await user.save();
    res.status(201).send(team);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const startIndex = (page - 1) * limit;
  const search = req.query.search || "";
  const sort = req.query.sort || "name";
  try {
    const teams = await Team.find({
      createdBy: req.user.id,
      name: new RegExp(search, "i"),
    })
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .populate("members", "email")
      .populate("admin", "email")
      .exec();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, members } = req.body;
    const team = await Team.findOne({
      _id: id,
      "members.user": req.user._id,
      "members.role": "Admin",
    });
    if (!team) return res.status(403).send({ message: "Unauthorized" });

    team.name = name || team.name;
    team.members = members || team.members;
    await team.save();
    res.send(team);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findOneAndDelete({
      _id: id,
      "members.user": req.user._id,
      "members.role": "Admin",
    });
    if (!team) return res.status(403).send({ message: "Unauthorized" });
    res.send({ message: "Team deleted" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const team = await Team.findOne({
      _id: id,
      "members.user": req.user._id,
      "members.role": "Admin",
    });
    if (!team) return res.status(403).send({ message: "Unauthorized" });

    if (user.teams.length >= 5)
      return res.status(400).send({ message: "User max teams limit reached" });
    team.members.push({ user: user._id, role });
    user.teams.push(team._id);
    await team.save();
    await user.save();
    res.send({ message: "Member added", team });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const team = await Team.findOne({
      _id: id,
      "members.user": req.user._id,
      "members.role": "Admin",
    });
    if (!team) return res.status(403).send({ message: "Unauthorized" });

    team.members = team.members.filter((m) => m.user.toString() !== memberId);
    const user = await User.findById(memberId);
    user.teams = user.teams.filter((t) => t.toString() !== id);
    await team.save();
    await user.save();
    res.send({ message: "Member removed", team });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
