
'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.input.value = '';
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
    <span class="text-todo">${todo.value}</span>
    <div class="todo-buttons">
      <button class="todo-remove"></button>
      <button class="todo-complete"></button>
    </div>
    `);

    if(todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();
    if(this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      alert('Заполните поле "Какие планы?"');
    }
  }

  deliteItem(key) {

    let todoDataRes = new Map();

    this.todoData.forEach((item) => {
      if(item.key !== key){
        todoDataRes.set(item.key, item);
      }
    });
    this.todoData = todoDataRes;
    this.render();
  }

  completeItem(key) {
    this.todoData.forEach((item) => {
      if(item.key === key){
        item.completed = !item.completed;
      }
    });
    this.render();
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  handler() {

    const target = event.target;

    if(target.classList.value === 'todo-remove') {
      this.deliteItem(target.closest('li').key);
    } else if(target.classList.value === 'todo-complete') {
      this.completeItem(target.closest('li').key);
    }

  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));

    const todoContainer = document.querySelector('.todo-container');
    todoContainer.addEventListener('click', () => {
      this.handler();
    });

  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();









// const todoControl = document.querySelector('.todo-control'),
//       headerInput = document.querySelector('.header-input'),
//       todoList = document.querySelector('.todo-list'),
//       todoCompleted = document.querySelector('.todo-completed');

// let todoData = [];

// let outLocalStorage = function() {

//   if (localStorage.localJson !== undefined) {
//     todoData = JSON.parse(localStorage.localJson);
//     return todoData;
//   }
// };

// let inputLocalStorage = function() {
  
//   localStorage.localJson = JSON.stringify(todoData);
// };




// const render = function() {

//   todoList.textContent = '';
//   todoCompleted.textContent = '';
  
//   inputLocalStorage();
  
//   todoData.forEach(function(item){
//     const li = document.createElement('li');
//     li.classList.add('todo-item');
    
//     li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
//       '<div class="todo-buttons">' +
//         '<button class="todo-remove"></button>' +
//         '<button class="todo-complete"></button>' +
//       '</div>';

//     if (item.completed) {
//       todoCompleted.append(li);
//     } else {
//       todoList.append(li);
//     }

//     const btnTodoCompleted = li.querySelector('.todo-complete');
//     const btnTodoRemove = li.querySelector('.todo-remove');

//     btnTodoCompleted.addEventListener('click', function(){
//       item.completed = !item.completed; 

      
//       render();
//     });
    
//     btnTodoRemove.addEventListener('click', function(){

//       for (let i = 0; i < todoData.length; i++) {

//         if (todoData[i] === item) {
//           todoData.splice(i, 1);
//           i--;
//         }
//       }

//       render();
//     });
//   });
// };

// todoControl.addEventListener('submit', function(event){
//   event.preventDefault();
//   outLocalStorage();
//   headerInput.value = headerInput.value.trim();

//   if (headerInput.value !== '') {
//       const newTo = {
//       value: headerInput.value,
//       completed: false
//       };

//       todoData.push(newTo);
//   } else {
//     return;
//   }

//   headerInput.value = '';
  
//   render();

// });

// outLocalStorage();
// render();