import React from 'react';
import io from 'socket.io-client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


const App = () =>  {

  const [tasks, setTasks] = useState([]) ;
  const [taskName, setTaskName] = useState('');


  const socket = io("localhost:8000");
  socket.on('addTask', (task) => addTask(task));
  socket.on('removeTask', (id) => removeTask(id));
  socket.on('updateData', (data) => updateTasks(data));

  const updateTasks = (newTask) => {
    setTasks(newTask);
  };

  const removeTask = (id, local=false) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if(local) {
      socket.emit('removeTask', id)
    }
  };

  const submitForm = (event) => {
    event.preventDefault();
    addTask(taskName);
    setTaskName('')
    socket.emit('addTask', taskName);
  }

  const addTask = (task) => {
    setTasks([...tasks, task]);
  }

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task=> <li key={task.id} class="task">{task} <button class="btn btn--red" onClick={() => removeTask(task.id, true)}>Remove</button></li>)}
          </ul>

          <form id="add-task-form" onSubmit={submitForm}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.currentTarget.value)} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );


};

export default App;
