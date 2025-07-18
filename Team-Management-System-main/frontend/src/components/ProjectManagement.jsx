import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/authContext";

const ProjectManagement = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const resp = await axios.get(
      `/api/v1/projects?page=${page}&search=${search}&sort=name`,
      { headers }
    );
    setProjects(resp.data);
  };

  const handleCreate = async (values, { resetForm }) => {
    const token = localStorage.getItem("token");
    await axios.post("/api/v1/projects", values, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
    resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    team: Yup.string().required("Required"),
    members: Yup.array().of(Yup.string()),
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Manage Projects</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border p-2 mb-4 w-full max-w-md"
      />
      <Formik
        initialValues={{ name: "", team: "", members: [] }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
      >
        {({ errors, touched }) => (
          <Form className="mb-6">
            <Field
              name="name"
              placeholder="Project Name"
              className="border p-2 mb-2 w-full"
            />
            {errors.name && touched.name && (
              <div className="text-red-500">{errors.name}</div>
            )}
            <Field
              name="team"
              placeholder="Team ID"
              className="border p-2 mb-2 w-full"
            />
            {errors.team && touched.team && (
              <div className="text-red-500">{errors.team}</div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create Project
            </button>
          </Form>
        )}
      </Formik>
      {projects.map((project) => (
        <div key={project._id} className="bg-white p-2 mb-2 rounded shadow">
          {project.name} (Team: {project.team.name})
        </div>
      ))}
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
      <button
        onClick={() => navigate("/admin")}
        className="bg-gray-500 text-white p-2 rounded mt-4"
      >
        Back
      </button>
    </div>
  );
};

export default ProjectManagement;
