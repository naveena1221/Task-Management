import React, { useEffect, useState } from 'react';
import './DashBoard.css';

function DashBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDate, setTaskDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
   
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks(filteredTasks);
  };
  const handlePriorityChange = (event) => {
    const priority = event.target.value;
  setSelectedPriority(priority);
  
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks) {
    if (priority === '') {
      setTasks(storedTasks);
    } else {
      const filteredTasks = storedTasks.filter((task) => task.priority === priority);
      setTasks(filteredTasks);
    }
  }
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
  setSelectedStatus(status);

  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  let filteredTasks = storedTasks;

  if (status === 'upcoming') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    filteredTasks = storedTasks.filter(
      (task) => new Date(task.date) >= tomorrow && !task.completed
    );
  } else if (status === 'overdue') {
    const today = new Date();
    filteredTasks = storedTasks.filter(
      (task) => new Date(task.date) < today && !task.completed
    );
  } else if (status === 'completed') {
    filteredTasks = storedTasks.filter((task) => task.completed);
  }

  setTasks(filteredTasks);
  };

  





  const handleCreateTask = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleClear=()=>{
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setSearchTerm('');
    setSelectedPriority('');
  setSelectedStatus('all');
  }
  const handleAddTask = () => {
    if (editTaskId !== null) {

        const updatedTasks = tasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: taskTitle, description: taskDescription, priority: taskPriority, date: taskDate }
            : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setTaskDate('');
        setIsModalOpen(false);
        setEditTaskId(null);
      } else {
        // Add a new task
        const newTask = {
          id: Math.random().toString(36).substr(2, 9),
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          date: taskDate,
        };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setIsModalOpen(false);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setTaskDate('');
    }
  };
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskTitle(taskToEdit.title);
    setTaskDescription(taskToEdit.description);
    setTaskPriority(taskToEdit.priority);
    setTaskDate(taskToEdit.date);
    setIsModalOpen(true);
    setEditTaskId(taskId);
}

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    console.log('Deleting task:', taskId);
  };
  const handleCheckboxChange = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  return (
    <div className='dashboard-container' style={{display:'flex', gap:'50px'}}>
         {isSidebarOpen && (
      <div className='sidebar'>
        <h2 style={{fontFamily:'cursive'}}>Task Pro</h2>
        <div className='sidebar-item search-container'>
          <input
            type='text'
            placeholder='Search tasks...'
            value={searchTerm}
            onChange={handleInputChange}
            className='input'
          />
          <button className='button' onClick={handleSearch} style={{margin:'10px', width:'40px',height:'40px'}}>
              <i className='fas fa-search'></i>
            </button>
        </div>
        <div className='sidebar-item'>
          <button className='button' style={{width:'250px'}} onClick={handleCreateTask}>Create New Task</button>
        </div>
        <div className='sidebar-item'>
          <select className='dropdown' value={selectedStatus} onChange={handleStatusChange} style={{width:'250px',height:'40px', backgroundColor:'#363b4e',color:'#c4bbf0', borderRadius:'10px'}}>
            <option value='all'>All Tasks</option>
            <option value='upcoming'>Upcoming Tasks</option>
            <option value='overdue'>Overdue Tasks</option>
            <option value='completed'>Completed Tasks</option>
          </select>
        </div>
      </div>
      )}
      <div className='content'>
        <div className='Header' style={{display:'flex', alignItems:'center', gap:'20px'}}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: '10px', marginLeft:'10px' }}>
            {isSidebarOpen ? '<<' : '>>'}
          </button>
        <h1 style={{flex:'3'}}>Hello, welcome</h1>
        <button onClick={() => handleClear() } style={{padding:'10px'}}>Clear</button>
        <select className='dropdown' value={selectedPriority} onChange={handlePriorityChange} style={{width:'200px',height:'40px', backgroundColor:'#363b4e',color:'#c4bbf0', borderRadius:'10px', marginRight:'10px'}}>
            <option value=''>Select Priority</option>
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>

        </div>
        <div className='task-list-container' style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)'}}>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{display:'flex',gap:'20px', border:'2px solid #927fbf', margin:'10px',padding:'10px', alignItems:'center'}}>
              <div className="checkbox-wrapper-12">
              <div className="cbx">
                <input
                  type="checkbox"
                  id={`cbx-${task.id}`}
                  checked={task.completed}
                  onChange={() => handleCheckboxChange(task.id)}
                />
                <label htmlFor={`cbx-${task.id}`}></label>
                <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                  <path d="M2 8.36364L6.23077 12L13 2"></path>
                </svg>
              </div>
            </div>
            <div><h2>{task.title}</h2>
              <p style={{width:'500px'}}>{task.description}</p></div>
              <span>Date: {task.date}</span>
              <span style={{width:'150px'}}>Priority: {task.priority}</span>
              <button onClick={() => handleEditTask(task.id)} style={{padding:'15px'}}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id) } style={{padding:'10px'}}>Delete</button>
            </li>
          ))}
        </ul>
        )}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{editTaskId ? 'Edit Task' : 'Create New Task'}</h2>
            <div className='modalStyles' style={{ display: 'flex',  gap: '10px' }}>
                <div className='TitleDescription' style={{ width: '80%' }}>
                <div className='Title' >
                <input className='modalItems' type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={{width:'300px', height:'25px',marginBottom:'10px'}} />
              </div>
              <div className='Description' style={{ width: '90%' }}>
                <textarea className='modalItems' placeholder="Task Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows={8} cols={39} style={{marginBottom:'10px'}} />
              </div>
                </div>
              
              <div className='PriorityDate' >
                <select className='modalItems' value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} style={{width:'150px', height:'30px',marginBottom:'10px'}}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input className='modalItems' type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} style={{width:'150px', height:'30px'}} />
              </div>
            </div>
            <div className='Button' style={{ textAlign: 'center' }}>
            <button onClick={handleAddTask}>{editTaskId ? 'Update Task' : 'Add Task'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
