import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/dateUtils';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ 
    title: '', 
    description: '',
    status: 'PENDING' 
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const [taskResponse, commentsResponse] = await Promise.all([
          axios.get(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`/api/tasks/${id}/comments`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setTask(taskResponse.data);
        setEditedTask({
          title: taskResponse.data.title,
          description: taskResponse.data.description,
          status: taskResponse.data.status || 'PENDING'
        });
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch task details');
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/tasks/${id}`, editedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/tasks/${id}/comments`, 
        { content: newComment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/tasks');
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                <div className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{task.description}</p>

            <div className="border-t pt-4 mt-4">
              <h2 className="text-xl font-semibold mb-4">Task Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Created At:</p>
                  <p>{formatDate(task.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated:</p>
                  <p>{formatDate(task.updated_at)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div 
                key={comment.id} 
                className="bg-gray-100 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{comment.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;