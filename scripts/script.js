
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
    const editBtn = document.createElement('button');
    editBtn.classList.add('todo-edit');
    editBtn.style.border = '2px,solid,black';
    editBtn.textContent = 'Редактировать';
    li.prepend(editBtn);
    

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

  editItem(key, target) {

    const editSpan = target.closest('li').querySelector('span');
    const editBtn = target.closest('li').querySelector('.todo-edit');

    editSpan.contentEditable = true;
    editBtn.disabled = true;

    const editEnd = e => {
      editSpan.contentEditable = false;
      editBtn.disabled = false;

      this.todoData.forEach((item) => {
        if(item.key === key){

          item.value = editSpan.innerHTML;
          this.addToStorage();
        }
      });

      editSpan.removeEventListener('blur', editEnd);
    };

    editSpan.addEventListener('blur', editEnd);
    
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deliteAnimation(key, target) {
    
    const deliteLi = target.closest('li');
    let count = 0,
        requestId;

    const delAnim = () => {
      
      count += 4;
      if(count < 120){
        deliteLi.style.transform = `translateX(${count}%)`;
        requestAnimationFrame(delAnim);
      } else {
        cancelAnimationFrame(requestId);
        this.deliteItem(key);
      }
    }
    requestId = requestAnimationFrame(delAnim);
  }

  removeAnimation(key, target) {
        
    const removeLi = target.closest('li');
    let count = 100,
        requestIdOff;

    const remAnim = () => {
      count -= 4;
      if(count >= 0) {
        removeLi.style.opacity = `${count}%`;
        requestAnimationFrame(remAnim);
      } else {
        cancelAnimationFrame(requestIdOff);
        this.completeItem(key);
        this.removeAnimationOn(key);
      }
    };

    requestIdOff = requestAnimationFrame(remAnim);
    
  }
  
  removeAnimationOn(key) {

    const allLi = document.querySelectorAll('li');
    
    let count = 0,
    requestIdOn,
    removeLi;

    allLi.forEach((item) => {
      if(item.key === key){
        removeLi = item;
      }
    });

    const remAnimOn = () => {
      console.log(count);
      count += 4;
      if(count <= 100) {
        removeLi.style.opacity = `${count}%`;
        requestAnimationFrame(remAnimOn);
      } else {
        cancelAnimationFrame(requestIdOn);
      }
    };
    // requestIdOn = requestAnimationFrame(remAnimOn);
  }


  handler(event) {

    const target = event.target;
    

    if(target.classList.value === 'todo-remove') {
      this.deliteAnimation(target.closest('li').key, target);
    } else if(target.classList.value === 'todo-complete') {
      this.removeAnimation(target.closest('li').key, target);
    } else if(target.classList.value === 'todo-edit') {
      this.editItem(target.closest('li').key, target);
    }
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));

    const todoContainer = document.querySelector('.todo-container');
    todoContainer.addEventListener('click', () => {
      this.handler(event);
    });

    this.render();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();