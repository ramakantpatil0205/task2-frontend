import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })

  const api = axios.create({ baseURL: 'http://localhost:5000' })

  const loadTasks = async () => {
    const res = await api.get('/tasks')
    setTasks(res.data)
  }

  const addTask = async () => {
    if (!newTask.title) return
    await api.post('/tasks', newTask)
    setNewTask({ title: '', description: '' })
    loadTasks()
  }

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`)
    loadTasks()
  }

  const addComment = async (taskId, body) => {
    await api.post('/comments', { task_id: taskId, body, author: 'web' })
    loadTasks()
  }

  const deleteComment = async (id) => {
    await api.delete(`/comments/${id}`)
    loadTasks()
  }

  useEffect(() => { loadTasks() }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks & Comments</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={addTask}>Add</button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500">Delete</button>
          </div>

          <div className="mt-3">
            <Comments taskId={task.id} comments={task.comments} addComment={addComment} deleteComment={deleteComment} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Comments({ taskId, comments = [], addComment, deleteComment }) {
  const [body, setBody] = useState('')

  return (
    <div>
      <h3 className="font-medium mb-2">Comments</h3>
      <div className="space-y-2">
        {comments && comments.length > 0 ? comments.map(c => (
          <div key={c.id} className="flex justify-between bg-gray-50 p-2 rounded">
            <span>{c.author}: {c.body}</span>
            <button onClick={() => deleteComment(c.id)} className="text-sm text-red-500">Delete</button>
          </div>
        )) : <p className="text-sm text-gray-500">No comments yet</p>}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="border p-1 flex-1"
          placeholder="Write a comment..."
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <button onClick={() => { addComment(taskId, body); setBody('') }} className="bg-green-500 text-white px-3 rounded">Add</button>
      </div>
    </div>
  )
}
