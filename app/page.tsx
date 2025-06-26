'use client';

import { useEffect, useState } from 'react';

type Student = {
  roll: number;
  firstname: string;
  lastname: string;
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState({ roll: '', firstname: '', lastname: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

const filteredStudents = students.filter(
  s =>
    s.roll.toString().includes(search) ||
    s.firstname.toLowerCase().includes(search.toLowerCase()) ||
    s.lastname.toLowerCase().includes(search.toLowerCase())
);

  const handleDelete = async (roll: number) => {
    const confirmation = confirm(`Are you sure you want to delete student with roll number ${roll}?`);
    if (!confirmation) return;

    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roll }),
      });

      if (!res.ok) throw new Error('Failed to delete student');

      setStudents(students.filter(s => s.roll !== roll));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setForm({ roll: '', firstname: '', lastname: '' });
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setModalType('edit');
    setForm({ 
      roll: String(student.roll), 
      firstname: student.firstname,
      lastname: student.lastname 
    });
    setShowModal(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (modalType === 'add') {
        const res = await fetch('/api/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rollno: Number(form.roll),
            firstName: form.firstname,
            lastName: form.lastname,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to add student');
        }

        const { student } = await res.json();
        setStudents([...students, {
          roll: student.roll,
          firstname: student.firstname,
          lastname: student.lastname
        }]);
        setShowModal(false);
      } else {
        const res = await fetch(`/api/put/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rollno: Number(form.roll),
            firstName: form.firstname,
            lastName: form.lastname,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update student');
        }

        const { student } = await res.json();
        setStudents(students.map(s => 
          s.roll === student.roll ? {
            roll: student.roll,
            firstname: student.firstname,
            lastname: student.lastname
          } : s
        ));
        setShowModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="w-full flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Student List</h1>
          <div>
            <input type="text" placeholder='search......'  value={search} onChange={e => setSearch(e.target.value)} className='bg-white p-3 rounded-2xl border-black' />
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Add Student
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50">
            <h4 className="font-medium">Total Students: {students.length}</h4>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((s, i) => (
                    <tr key={s.roll}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.roll}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.firstname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.lastname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(s)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.roll)}
                          className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px] max-w-md w-full">
              <h2 className="text-lg font-bold mb-4">
                {modalType === 'add' ? 'Add Student' : 'Edit Student'}
              </h2>
              <form onSubmit={handleModalSubmit} className="flex flex-col gap-3">
                <input
                  type="number"
                  name="roll"
                  placeholder="Roll Number"
                  value={form.roll}
                  onChange={handleModalChange}
                  className="border p-2 rounded"
                  required
                  disabled={modalType === 'edit'}
                />
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleModalChange}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleModalChange}
                  className="border p-2 rounded"
                  required
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                  >
                    {modalType === 'add' ? 'Add' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}