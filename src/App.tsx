import { useState, ChangeEvent, useEffect } from 'react'
import './App.css'

interface Task {
  id: number,
  name: string;
}

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState<string>("");
  const [editId, setEditIt] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(data));
  }, [data]);

  const addTask = () => {
    if (!task.trim()) {
      setShowModal(true);
      return;
    }

    if (editId !== null) {
      const updated = data.map((t) => t.id === editId ? { ...t, name: task } : t);
      setData(updated);
      setEditIt(null);
    } else {
      setData([...data, { id: Date.now(), name: task }]);
    }

    setTask("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value)
  };

  const deleteTask = (id: number) => {
    const filtered = data.filter((t) => t.id !== id);
    setData(filtered);
  };

  const editTask = (id: number) => {
    const toEdit = data.find((t) => t.id === id);

    if (toEdit) {
      setTask(toEdit.name);
      setEditIt(id);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className='app'>
      <h1>To-Do List</h1>
      <div className='input-wrapper'>
        <input type="text"
          value={task}
          onChange={handleInputChange} placeholder='Enter a task' />
        <button onClick={addTask}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {data.map((t) => (
          <li key={t.id}>
            {t.name}
            <div className="manage-btns">
              <button onClick={() => editTask(t.id)}>Edit</button>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>You must write something!</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
