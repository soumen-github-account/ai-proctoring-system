import React, { useContext, useEffect, useState } from 'react'
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';
import { AppContext } from '../contexts/AppContext';
import axios from "axios"
import toast from 'react-hot-toast';

const AddCandidate = () => {
    const {backendUrl} = useContext(AppContext)
    const [candidates, setCandidates] = useState([]);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleAdd = async(candidate) => {
      setLoading(true)
      try {
        const {data} = await axios.post(`${backendUrl}/api/users/add-student/`, 
        {
          name: candidate.name,
          cId: candidate.studentId,
          email: candidate.email,
          phone: candidate.phone,
          password: candidate.password
        }, {headers:{"Content-Type": "application/json"}});
        if(data.success){
          toast.success(data.message)
          fetchStudent()
          setLoading(false)
        } else{
          toast.error(data.message)
          setLoading(false)
        }
      } catch (err) {
        toast.error(err)
        setLoading(false)
      }
      // setCandidates([...candidates, { ...candidate, id: Date.now() }]);
    };

    const handleUpdate = async(candidate, cId) => {
        setLoading(true)
        try {
          const {data} = await axios.put(`${backendUrl}/api/users/update-student/${cId}/`,
            {
              name: candidate.name,
              cId: candidate.studentId,
              email: candidate.email,
              phone: candidate.phone,
              password: candidate.password
            }, {headers: {"Content-Type": "application/json"}}
           )

          if(data.success){
          toast.success(data.message)
          setLoading(false)
          } else{
          toast.error(data.message)
          setLoading(false)
          }
          
        } catch (err) {
          console.log(err)
          setLoading(false)
        }
    };

    const handleDelete = async(id) => {
      setDeleteLoading(true)
      try {
        const {data} = await axios.delete(`${backendUrl}/api/users/delete-student/${id}/`)

        if(data.success){
          toast.success(data.message)
          fetchStudent()
          setDeleteLoading(false)
        } else{
          toast.error(data.message)
          setDeleteLoading(true)
        }
      } catch (err) {
        console.log(err)
        setDeleteLoading(false)
      }
    };

    const fetchStudent = async()=>{
      try {
        const {data} = await axios.get(`${backendUrl}/api/users/students/`);
        setCandidates(data)
      } catch (err) {
        toast.error("Failed to load student")
      }
    }

    useEffect(()=>{
      fetchStudent()
    },[])
  return (
    <div className="p-6 bg-gray-50 min-h-[90vh]">
        <h1 className="text-2xl font-semibold mb-6">
            Add Candidates
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CandidateForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          loading={loading}
          editingCandidate={editingCandidate}
        />

        <CandidateList
          candidates={candidates}
          onEdit={setEditingCandidate}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />
      </div>
    </div>
  )
}

export default AddCandidate
