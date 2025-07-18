import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { toast } from "react-toastify";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
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

      // Debugging logs
      console.log("Raw Teams Response:", teamRes.data);
      console.log("Raw Projects Response:", projectRes.data);

      // Filter teams where user is a member
      const userTeams = Array.isArray(teamRes.data)
        ? teamRes.data.filter((team) =>
            team.members.some((m) => m.user.toString() === user.id)
          )
        : [];
      setTeams(userTeams);

      // Filter projects where user is a member (assuming 'members' field)
      const userProjects = Array.isArray(projectRes.data.data)
        ? projectRes.data.data.filter((project) =>
            project.members?.some((m) => m.toString() === user.id)
          )
        : [];
      setProjects(userProjects);
    } catch (err) {
      toast.error(`Failed to fetch data: ${err.message}`);
      console.error("Fetch Error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Welcome, {user.role}</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border p-2 mb-4"
      />
      <div>
        <h2 className="text-xl mb-2">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-500">No teams found.</p>
        ) : (
          teams.map((team) => (
            <div key={team._id} className="bg-white p-2 mb-2 rounded shadow">
              {team.name}
            </div>
          ))
        )}
      </div>
      <div>
        <h2 className="text-xl mb-2">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-white p-2 mb-2 rounded shadow">
              {project.name} (Team: {project.team?.name})
            </div>
          ))
        )}
      </div>
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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}
