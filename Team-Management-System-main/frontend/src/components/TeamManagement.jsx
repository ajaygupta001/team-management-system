import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/authContext';

const TeamManagement = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const resp = await axios.get(`/api/v1/teams?page=${page}&search=${search}&sort=name`, { headers });
    setTeams(resp.data);
  };

  const handleCreate = async (values, { resetForm }) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/v1/teams', values, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
    resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    members: Yup.array().of(Yup.string()),
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Manage Teams</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border p-2 mb-4 w-full max-w-md"
      />
      <Formik
        initialValues={{ name: '', members: [] }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
      >
        {({ errors, touched }) => (
          <Form className="mb-6">
            <Field name="name" placeholder="Team Name" className="border p-2 mb-2 w-full" />
            {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Team</button>
          </Form>
        )}
      </Formik>
      {teams.map(team => (
        <div key={team._id} className="bg-white p-2 mb-2 rounded shadow">
          {team.name} (Admin: {team.admin.email})
        </div>
      ))}
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className="bg-gray-500 text-white p-2 rounded mr-2">Prev</button>
      <button onClick={() => setPage(page + 1)} className="bg-gray-500 text-white p-2 rounded">Next</button>
      <button onClick={() => navigate('/admin')} className="bg-gray-500 text-white p-2 rounded mt-4">Back</button>
    </div>
  );
};

export default TeamManagement;