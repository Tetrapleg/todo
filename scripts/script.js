
'use strict';

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

let todoData = [];



let inputLocalStorage = function() {
  let json = JSON.stringify(todoData);
  localStorage.localJson = json;
};

let outLocalStorage = function() {
  todoData = JSON.parse(localStorage.localJson);
  console.log(todoData);
};

outLocalStorage();

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

      console.log(todoData.indexOf(item));
      delete todoData[todoData.indexOf(item)];
      render();
    });
  });
};

todoControl.addEventListener('submit', function(event){
  event.preventDefault();

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



render();