
'use strict';

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

let todoData = [];

let outLocalStorage = function() {

  if (localStorage.localJson !== undefined) {
    todoData = JSON.parse(localStorage.localJson);
    return todoData;
  }
};

let inputLocalStorage = function() {
  
  localStorage.localJson = JSON.stringify(todoData);
};




const render = function() {

  todoList.textContent = '';
  todoCompleted.textContent = '';
  
  inputLocalStorage();
  
  todoData.forEach(function(item){
    const li = document.createElement('li');
    li.classList.add('todo-item');
    
    li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
      '<div class="todo-buttons">' +
        '<button class="todo-remove"></button>' +
        '<button class="todo-complete"></button>' +
      '</div>';

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }

    const btnTodoCompleted = li.querySelector('.todo-complete');
    const btnTodoRemove = li.querySelector('.todo-remove');

    btnTodoCompleted.addEventListener('click', function(){
      item.completed = !item.completed; 

      
      render();
    });
    
    btnTodoRemove.addEventListener('click', function(){

      for (let i = 0; i < todoData.length; i++) {

        if (todoData[i] === item) {
          todoData.splice(i, 1);
          i--;
        }
      }

      render();
    });
  });
};

todoControl.addEventListener('submit', function(event){
  event.preventDefault();
  outLocalStorage();
  headerInput.value = headerInput.value.trim();

  if (headerInput.value !== '') {
      const newTo = {
      value: headerInput.value,
      completed: false
      };

      todoData.push(newTo);
  } else {
    return;
  }

  headerInput.value = '';
  
  render();

});

outLocalStorage();
render();