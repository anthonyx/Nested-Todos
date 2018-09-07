// Steps:

  /* 1. Understand how the app works
   * 2. Decide what needs to be changed to fit the new features
   * 3. Figure out out how to nest

   * (Optional) Write tests
   */


// Design Implementation:
  /*
   * (x) Add AddNested Button
   * (x) Add AddNested Function on todoList object
   * (x) Add nestedTodoPrompt popup in handler
   * (x) Modify displayTodos to recursively append nested objects
   * (x) Modify changeTodo to work for nested todos
   * (x) Modify deleteTodo to work for nested todos
   */
// Each todo will contain:
    // Completed property
    // Text property
    // Delete property
    // Add Todo property (need to accept ID to see whether it's nested)
    // Change Todo property
    // ID property
    // Nested property (contains level of nesting)

// What I want it to look like:

// (x) Todo AddTodo DeleteTodo
  // (x) Todo AddTodo DeleteTodo

// Currently the todos array has todos objects
// Each todo object in the array will need to have a nested todo property that is set to undefined by default
  // Currently: todos = [{todoText: 'todoText', completed: false}]
  // New: todos = [{todoText: 'todoText', completed: false, nestedTodo: undefined, id: uuid}]
// In addition, displayTodos will need to recursively append children whenever nestedTodo is not undefined



var todoList = {

  // Create an empty todos array
  todos: [],
  uuid: function () {
    /*jshint bitwise:false */
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },

  // Add a nested todo
  addNestedTodo: function(id, todoText, array) {
    for (var i = 0; i < array.length; i++) {
      if(array[i].nestedTodo.length > 0) {
        for (var x = 0; x < array[i].nestedTodo.length; x++) {
          this.addNestedTodo(id, todoText, array[i].nestedTodo);
        }
      }

      if(array[i].id === id) {
        array[i].nestedTodo.push({
          todoText: todoText,
          completed: false,
          id: this.uuid(),
          nestedTodo: []
        })
      }
    }
  },

  // Create a new todo with text and completed property
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false,
      id: this.uuid(),
      nestedTodo: []
    });
  },
  // Change a specified todo's text property when given position and text
  changeTodo: function(id, todoText, array) {
    for (var i = 0; i < array.length; i++) {
      if(array[i].nestedTodo.length > 0) {
        for (var x = 0; x < array[i].nestedTodo.length; x++) {
          this.changeTodo(id, todoText, array[i].nestedTodo);
        }
      }
      if(array[i].id === id) {
        array[i].todoText = todoText;
      }
    }
    
  },

  // Delete a todo when given position
  deleteTodo: function(id, array) {
    for (var i = 0; i < array.length; i++) {
      if(array[i].nestedTodo.length > 0) {
        for (var x = 0; x < array[i].nestedTodo.length; x++) {
          this.deleteTodo(id, array[i].nestedTodo);
        }
      }
      if(array[i].id === id) {
        array.splice(i, 1);
      }
    }
  },

  // Toggle completed property when given position
  toggleCompleted: function(id, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].nestedTodo.length > 0) {
        for (var x = 0; x < array[i].nestedTodo.length; x++) {
          this.toggleCompleted(id, array[i].nestedTodo);
        }
      }

      if(array[i].id === id) {
        var todo = array[i];
        todo.completed = !todo.completed;
      }
    }
    
  },
  toggleAll: function() {
    
    // If everything is true, make everything false
    // Otherwise, make everything true
    
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    
    // Get number of completed todos.
    
    this.todos.forEach(function(todo) {
      if(todo.completed === true) {
        completedTodos++;
      }
    });
    
    this.todos.forEach(function(todo) {
      // Case 1: If everything’s true, make everything false.
      if(completedTodos === totalTodos) {
        todo.completed = false;
      } else {
      // Case 2: Otherwise, make everything true.
        todo.completed = true;
      }
    });
  }
};

var handlers = {

  // Grab the addTodoTextInput element
  // If empty, step out of function
  // If value, then run addTodo function and clear input bar
  // Render
  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    if(addTodoTextInput.value === "") {
      return
    } else {
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    }
    view.displayTodos();
  },

  // Grab the changeTodoInput and changeTodoPositionInput
  changeTodo: function() {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput.value, changeTodoTextInput.value, todoList.todos);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
    view.displayTodos();
  },
  deleteTodo: function(id) {
    todoList.deleteTodo(id, todoList.todos);
    view.displayTodos();
  },
  nestedTodoPrompt: function() {
    var result = window.prompt('Enter text')
    return result;
  },
  toggleCompleted: function() {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.value, todoList.todos);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }
};

var view = {
  displayTodos: function() {
    var todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';
    
    // todoList.todos.forEach(function(todo) {
    //   var todoLi = document.createElement('li');
    //   var todoTextWithCompletion = '';

    //   if (todo.completed === true) {
    //     todoTextWithCompletion = '(x) ' + todo.todoText;
    //   } else {
    //     todoTextWithCompletion = '( ) ' + todo.todoText;
    //   }
    //   todoLi.id = todo.id;
    //   todoLi.textContent = todoTextWithCompletion;
    //   todoLi.appendChild(this.createDeleteButton());
    //   todoLi.appendChild(this.createNestedTodoButton());
    //   todosUl.appendChild(todoLi);      
    // }, this);




    // New todoList:

    // Either todo is an array or not an array

      // If array, run on each element of the array
      // If not array, run base case

    // Skeleton recurion function:
    function recursiveAppend(todo, parentElement) {
      // base case:
      if(todo.nestedTodo.length === 0) {
        // append normally?
        var todoLi = document.createElement('li');
        var todoTextWithCompletion = '';

        if (todo.completed === true) {
          todoTextWithCompletion = '(x) ' + todo.todoText;
        } else {
          todoTextWithCompletion = '( ) ' + todo.todoText;
        }
        todoLi.id = todo.id;
        todoLi.textContent = todoTextWithCompletion;
        todoLi.appendChild(view.createDeleteButton());
        todoLi.appendChild(view.createNestedTodoButton());
        todoLi.appendChild(view.createToggleTodoButton());
        todoLi.appendChild(view.createChangeTodoButton());
        parentElement.appendChild(todoLi);
      // recursive case:
      } else {
        var todoUl = document.createElement('ul');
        var todoLi = document.createElement('li');
        var todoTextWithCompletion = '';

        if (todo.completed === true) {
          todoTextWithCompletion = '(x) ' + todo.todoText;
        } else {
          todoTextWithCompletion = '( ) ' + todo.todoText;
        }
        todoLi.id = todo.id;
        todoLi.textContent = todoTextWithCompletion;
        todoLi.appendChild(view.createDeleteButton());
        todoLi.appendChild(view.createNestedTodoButton());
        todoLi.appendChild(view.createToggleTodoButton());
        todoLi.appendChild(view.createChangeTodoButton());
        parentElement.appendChild(todoLi);
        parentElement.appendChild(todoUl);

        // for(var i = 0; i < todo.nestedTodo.length; i++) {
        //   recursiveAppend(todo.nestedTodo[i], todoLi)
        // }

        for(var i = 0; i < todo.nestedTodo.length; i++) {
          recursiveAppend(todo.nestedTodo[i], todoUl)
        }
      }
    }

    var boundRecursiveAppend = recursiveAppend.bind(this);

    for (var i = 0; i < todoList.todos.length; i++) {
      boundRecursiveAppend(todoList.todos[i], todosUl);
    }



  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  createNestedTodoButton: function() {
    var nestedTodoButton = document.createElement('button');
    nestedTodoButton.textContent = 'Nest';
    nestedTodoButton.className = 'nestedButton';
    return nestedTodoButton;
  },
  createToggleTodoButton: function() {
    var toggleTodoButton = document.createElement('button');
    toggleTodoButton.textContent = 'Toggle';
    toggleTodoButton.className = 'toggleButton';
    return toggleTodoButton;
  },
  createChangeTodoButton: function() {
    var changeTodoButton = document.createElement('button');
    changeTodoButton.textContent = 'Change';
    changeTodoButton.className = 'changeButton';
    return changeTodoButton;
  },
  setUpEventListeners: function() {
    var todosUl = document.querySelector('ul');

    // Add Event Listener for delete button
    todosUl.addEventListener('click', function(event) {
      // Get element that was clicked on.
      var elementClicked = event.target;
      var elementId = event.target.parentElement.id;

      // Check if elementClicked is a delete button.

      if (elementClicked.className === 'deleteButton') {
        
        //Run handlers.deleteTodo(position).
        handlers.deleteTodo(elementId);
      } else if (elementClicked.className === 'nestedButton') {
        
        //Run handlers.deleteTodo(position).
        var todoText = handlers.nestedTodoPrompt();
        todoList.addNestedTodo(elementId, todoText, todoList.todos);
        view.displayTodos();
      } else if(elementClicked.className === 'toggleButton') {
        todoList.toggleCompleted(elementId, todoList.todos);
        view.displayTodos();
      } else if(elementClicked.className === 'changeButton') {
        var todoText = handlers.nestedTodoPrompt();
        todoList.changeTodo(elementId, todoText, todoList.todos);
        view.displayTodos();
      }
    });

    // // Add Event Listener for addNested button
    // todosUl.addEventListener('click', function(event) {
    //   // Get element that was clicked on.
    //   var elementClicked = event.target;

    //   // Check if elementClicked is a delete button.

    //   if (elementClicked.className === 'nestedButton') {
        
    //     //Run handlers.deleteTodo(position).
    //     var todoText = handlers.nestedTodoPrompt();
    //     var elementId = event.target.parentElement.id;
    //     todoList.addNestedTodo(elementId, todoText, todoList.todos);
    //     view.displayTodos();
    //   }
    // });

    function addEventListenerFunction(elementId, eventType, keyCode, runFunction) {
      var element = document.getElementById(elementId);
      element.addEventListener(eventType, function(event){
        if(event.keyCode === keyCode) {
          runFunction();
        }
      });
    }

    addEventListenerFunction('addTodoTextInput', 'keydown', 13, handlers.addTodo);
    addEventListenerFunction('changeTodoTextInput', 'keydown', 13, handlers.changeTodo);
    addEventListenerFunction('toggleCompletedPositionInput', 'keydown', 13, handlers.toggleCompleted);
  }
};

view.setUpEventListeners();




