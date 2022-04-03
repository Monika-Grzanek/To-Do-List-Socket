import React from 'react';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const App = () =>  {

  const [tasks, setTasks] = useState([]) ;
  const [taskName, setTaskName] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("localhost:8000", { transports: ['websocket'] }));
  }, []);

  useEffect(() => {
    if(socket) {
      socket.on('updateData', (data) => updateTasks(data));
      socket.on('addTask', (task) => addTask(task));
      socket.on('removeTask', (id) => removeTask(id));
    }
  }, [socket]);


  const updateTasks = (newTask) => {
    setTasks(newTask);
  };

  const removeTask = (id, local) => {
    setTasks((tasks => tasks.filter(task => task.id !== id)));
    if(local) {
      socket.emit('removeTask', id)
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const newTaskAdd = {id, name: taskName};
    addTask(newTaskAdd);
    setTaskName('')
    socket.emit('addTask', newTaskAdd);
  }

  const addTask = (task) => {
    setTasks((tasks => [...tasks, task]));
    console.log('show tasks', tasks)
  }

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(({id, name})=> <li key={id} className="task">{name} <button class="btn btn--red" onClick={() => removeTask(id, true)}>Remove</button></li>)}
          </ul>

          <form id="add-task-form" onSubmit={e => submitForm(e)}>
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.currentTarget.value)} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
};

export default App;
