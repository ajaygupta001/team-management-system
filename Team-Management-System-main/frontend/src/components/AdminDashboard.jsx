import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [newProject, setNewProject] = useState({ name: "", team: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }
      const [teamRes, projectRes] = await Promise.all([
        axios.get(`/api/v1/teams?page=${page}&limit=5&search=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/v1/projects?page=${page}&limit=5&search=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Raw Teams Response:", teamRes.data);
      console.log("Raw Projects Response:", projectRes.data);

      // Filter teams where user is admin (assuming backend returns all teams)
      // const userTeams = teamRes.data.filter((team) =>
      //   team.members.some((m) => m.user === user.id && m.role === "Admin")
      // );

      // const userTeams = teamRes.data.filter(
      //   (team) => team.admin._id === user.id
      // );
      const userTeams = teamRes.data.filter(
        (team) => team.createdBy === user.id
      );

      // console.log("gggg", userTeams);

      setTeams(userTeams || []);
      setProjects(projectRes.data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch data: ${err.message}`);
    }
  };

  const handleCreateTeam = async () => {
    const name = prompt("Enter team name");
    if (name) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        await axios.post(
          "/api/v1/teams",
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
        toast.success("Team created");
      } catch (err) {
        toast.error(`Failed to create team: ${err.message}`);
      }
    }
  };

  const handleInviteMember = async (teamId) => {
    const email = prompt("Enter member email");
    if (email) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        await axios.post(
          `/api/v1/teams/${teamId}/members`,
          { email, role: "Member" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
        toast.success("Member invited");
      } catch (err) {
        toast.error(`Failed to invite member: ${err.message}`);
      }
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        await axios.delete(`/api/v1/teams/${teamId}/members/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
        toast.success("Member removed");
      } catch (err) {
        toast.error(`Failed to remove member: ${err.message}`);
      }
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.post(
        "/api/v1/projects",
        { name: newProject.name, team: newProject.team },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProject({ name: "", team: "" });
      fetchData();
      toast.success("Project created");
    } catch (err) {
      toast.error(`Failed to create project: ${err.message}`);
    }
  };

  const handleUpdateProject = async (id) => {
    const name = prompt("Enter new project name");
    if (name) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        await axios.put(
          `/api/v1/projects/${id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
        toast.success("Project updated");
      } catch (err) {
        toast.error(`Failed to update project: ${err.message}`);
      }
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        await axios.delete(`/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
        toast.success("Project deleted");
      } catch (err) {
        toast.error(`Failed to delete project: ${err.message}`);
      }
    }
  };

  const exportCSV = () => {
    const csv = projects.map((p) => `${p.name},${p.team?.name}`).join("\n");
    const blob = new Blob([`Name,Team\n${csv}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl mb-4">Admin Dashboard</h2>
        <button
          onClick={handleCreateTeam}
          className="w-full bg-green-500 p-2 mb-2 text-white rounded"
        >
          Create Team
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full bg-red-500 p-2 text-white rounded"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-3xl mb-4">Welcome, {user.role}</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border p-2 mb-4"
        />
        <div>
          <h2 className="text-xl mb-2">Teams</h2>
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white p-2 mb-2 rounded shadow flex justify-between"
            >
              <span>{team.name}</span>
              <div>
                <button
                  onClick={() => handleInviteMember(team._id)}
                  className="ml-2 bg-blue-500 text-white p-1 rounded"
                >
                  Invite
                </button>

                {(team.members || []).map((member) => (
                  <button
                    key={member.user}
                    onClick={() => handleRemoveMember(team._id, member.user)}
                    className="ml-2 bg-red-500 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl mb-2">Projects</h2>
          <form onSubmit={handleCreateProject} className="mb-4">
            <input
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="Project Name"
              className="border p-2 mr-2"
              required
            />
            <select
              value={newProject.team}
              onChange={(e) =>
                setNewProject({ ...newProject, team: e.target.value })
              }
              className="border p-2"
              required
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 ml-2 rounded"
            >
              Create Project
            </button>
          </form>
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-2 mb-2 rounded shadow flex justify-between"
            >
              <span>
                {project.name} (Team: {project.team?.name})
              </span>
              <div>
                <button
                  onClick={() => handleUpdateProject(project._id)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={exportCSV}
            className="bg-green-500 text-white p-2 rounded mt-2"
          >
            Export CSV
          </button>
          <div>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-gray-500 text-white p-2 rounded mr-2"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
