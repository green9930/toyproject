/* app.js ------------------------------------------------------------------- */
$(document).ready(() => {
  // 배경화면 호출
  backgroundInit();
  // 위치정보 호출
  geoStart();
  // TODOLIST 호출
  getTodo(true);
  // QUOTE 호출
  show_quote();
});

/* BACKGROUND --------------------------------------------------------------- */
const body = document.querySelector('body');

const IMG_NUMBER = 29;

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `./static/images/${imgNumber + 1}.jpg`;
  image.classList.add('bgImage');
  body.prepend(image);
}

function getRandom() {
  const number = Math.floor(Math.random() * IMG_NUMBER);
  return number;
}

function backgroundInit() {
  const randomNumber = getRandom();
  paintImage(randomNumber);
}

/* WEATHER ------------------------------------------------------------------ */
function onGeoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const API_KEY = '5cedb12d7cfe681080f2af92fcdf062c';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: (res) => {
      const temp = Math.floor(res['main']['temp']);
      const city = res['name'];
      const dec = res['weather'][0]['main'];
      $('.weather01').text(dec);
      $('.weather02').text(temp);
      $('.weather03').text(city);
    },
  });
}

function onGeoError() {
  alert('위치 정보를 받을 수 없습니다.');
}

function geoStart() {
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}

/* CLOCK -------------------------------------------------------------------- */
const clock = document.querySelector('.clock');

function getClock() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  clock.innerText = `${hours}:${minutes}`;
}

getClock();
setInterval(getClock, 1000);

/* TODOLIST ----------------------------------------------------------------- */

const $todoInput = document.querySelector('.todo-input');
const $todoAddBtn = document.querySelector('.todo-enter');

/* TODO POPUP --------------------------------------------------------------- */
/* OPEN POPUP --------------------------------------------------------------- */
$(document).on('click', '.todo-list-item', function (e) {
  e.preventDefault();
  const targetText = e.currentTarget.children[0].innerText;
  const targetTimestamp = e.currentTarget.children[1].innerText;
  const arr = [...e.currentTarget.children[0].classList];
  const isTodoDone = arr.includes('todo-done');

  if (isTodoDone) {
    $('#edit-input').attr('disabled', true);
    $('.modify-btn').attr('disabled', true);
    $('#edit-input').attr('placeholder', '');
  } else {
    $('#edit-input').attr('disabled', false);
    $('.modify-btn').attr('disabled', false);
    $('#edit-input').attr('placeholder', targetText);
    $('.modify-btn').on('click', () => handleEditTodo(targetTimestamp));
  }

  $('.todo-pop').css('visibility', 'visible');

  getTodo(false);
});

/* CLOSE POPUP -------------------------------------------------------------- */
$(document).on('click', '.todo-pop-container', function (e) {
  if (e.target === e.currentTarget) {
    $('.todo-pop').css('visibility', 'hidden');
  }
});

/* READ TODO ---------------------------------------------------------------- */
const getTodo = (isMain) => {
  $.ajax({
    type: 'GET',
    url: '/todolist',
    data: {},
    success: (res) => {
      const data = res['todolist'];
      $todoInput.value = '';

      if (data.length >= 10) {
        $todoInput.disabled = true;
        $todoAddBtn.disabled = true;
        $todoInput.placeholder = '';
        const alert_html = `<span>오늘 할 일은 최대 10개까지 등록할 수 있습니다😊</span>`;
        $('.alert-box').empty();
        $('.alert-box').append(alert_html);
      } else {
        $todoInput.disabled = false;
        $todoAddBtn.disabled = false;
        $('.alert-box').empty();
      }

      if (isMain) {
        printMainTodo(data);
      } else {
        printMainTodo(data);
        printPopupTodo(data);
      }
    },
  });
};

const printPopupTodo = (data) => {
  $('.todo-popup-list').empty();

  data.map((item) => {
    const { todo, isDone, timestamp } = item;
    let todo_popup_html;
    if (isDone === 'false') {
      todo_popup_html = `<li>
                           <input type="checkbox" class="" />
                           <span class="todo-text">${todo}</span>
                           <span class="a11y-hidden">${timestamp}</span>
                           <button class='todo-delete-btn'>delete</button>
                           <button class='todo-edit-btn'>edit</button>
                         </li>`;
    } else {
      todo_popup_html = `<li>
                           <input type="checkbox" class="" checked/>
                           <span class="todo-text todo-done">${todo}</span>
                           <span class="a11y-hidden">${timestamp}</span>
                           <button class='todo-delete-btn'>delete</button>
                           <button class='todo-edit-btn' disabled>edit</button>
                         </li>`;
    }
    $('.todo-popup-list').append(todo_popup_html);
  });
};

const printMainTodo = (data) => {
  $('.todo-list-ul').empty();

  data.map((item) => {
    const { todo, isDone, timestamp } = item;
    let todo_html;
    if (isDone === 'false') {
      todo_html = `<li class='todo-list-item'>
                     <a href="#" class="todo-list-a">${todo}</a>
                     <span class="a11y-hidden">${timestamp}</span>
                   </li>`;
    } else if (isDone === 'true') {
      todo_html = `<li class='todo-list-item'>
                     <a href="#" class="todo-done todo-list-a">${todo}</a>
                     <span class="a11y-hidden">${timestamp}</span>
                   </li>`;
    }
    $('.todo-list-ul').append(todo_html);
  });
};

/* ADD TODO ----------------------------------------------------------------- */
const handleAddTodo = () => {
  const todoItem = $('.todo-input').val();

  if ($.trim(todoItem) === '') {
    $('.todo-input').focus();
    alert('Please enter your todo first.');
  } else {
    const timestamp = Date.now();

    $.ajax({
      type: 'POST',
      url: '/todolist',
      data: {
        todo_give: todoItem,
        isDone: false,
        timestamp: timestamp,
      },
      success: (res) => {
        alert(res['message']);
        getTodo(true);
        $('.todo-input').focus();
      },
    });
  }
};

/* TOGGLE TODO -------------------------------------------------------------- */
$('.todo-popup-list').on('change', (e) => {
  const targetIsDone = e.target.checked;
  const targetTodoText = e.target.parentElement.children[1].innerText;
  const targetTimestamp = e.target.parentElement.children[2].innerText;

  handleToggleTodo(targetIsDone, targetTimestamp);

  if (targetIsDone) {
    $('#edit-input').val('');
    $('#edit-input').attr('disabled', true);
    $('.modify-btn').attr('disabled', true);
    $('#edit-input').attr('placeholder', '');
  } else {
    $('#edit-input').attr('disabled', false);
    $('.modify-btn').attr('disabled', false);
    $('#edit-input').attr('placeholder', targetTodoText);
  }
});

const handleToggleTodo = (targetIsDone, targetTimestamp) => {
  $.ajax({
    type: 'POST',
    url: '/todolist/toggletodo',
    data: {
      targetTimestamp: targetTimestamp,
      todoIsDone: targetIsDone,
    },
    success: (res) => {
      console.log(res.message);
      getTodo(false);
    },
  });
};

/* EDIT TODO ---------------------------------------------------------------- */
const handleEditTodo = (targetTimestamp) => {
  const editTodoItem = $('#edit-input').val();

  if ($.trim(editTodoItem) === '') {
    $('#edit-input').focus();
    alert('Please enter your todo first.');
  } else {
    $.ajax({
      type: 'POST',
      url: '/todolist/edittodo',
      data: {
        new_todoText: editTodoItem,
        targetTimestamp: targetTimestamp,
      },
      success: (res) => {
        console.log(res.message);
        getTodo(false);
        $('#edit-input').val('');
        $('#edit-input').attr('placeholder', editTodoItem);
      },
    });
  }
};

/* CLICKED AT POPUP PAGE ---------------------------------------------------- */
$(document).on('click', '.todo-edit-btn', (e) => {
  $('.modify-btn').unbind();

  const targetTimestamp = e.target.parentElement.children[2].innerText;
  const targetText = e.target.parentElement.children[1].innerText;
  const todoIsDone = [...e.target.parentElement.children[1].classList].includes(
    'todo-done'
  );

  if (!todoIsDone) {
    $('#edit-input').attr('disabled', false);
    $('.modify-btn').attr('disabled', false);
    $('#edit-input').attr('placeholder', targetText);
  }
  $('#edit-input').attr('placeholder', targetText);
  $('#edit-input').val('');
  $('.modify-btn').on('click', () => handleEditTodo(targetTimestamp));
});

/* DELETE TODO -------------------------------------------------------------- */
$(document).on('click', '.todo-delete-btn', (e) => {
  const targetTimestamp = e.target.parentElement.children[2].innerText;
  const confirmDelete = confirm(`Are you sure you want to delete this todo?`);

  confirmDelete && handleDeleteTodo(targetTimestamp);
});

const handleDeleteTodo = (targetTimestamp) => {
  $.ajax({
    type: 'DELETE',
    url: '/todolist/deletetodo',
    data: {
      targetTimestamp: targetTimestamp,
    },
    success: (res) => {
      console.log(res['message']);
      getTodo(false);
    },
  });
};

/* QUOTE -------------------------------------------------------------------- */

$('#like_button').click(function () {
  $(this).prop('disabled', true);
  $(this).css('cursor', 'not-allowed');
  $('#dislike_button').prop('disabled', true);
  $('#dislike_button').css('cursor', 'not-allowed');
});

$('#dislike_button').click(function () {
  $(this).prop('disabled', true);
  $(this).css('cursor', 'not-allowed');
  $('#like_button').prop('disabled', true);
  $('#like_button').css('cursor', 'not-allowed');
});

function show_quote() {
  $.ajax({
    type: 'GET',
    url: '/quote',
    data: {},
    success: function (response) {
      $('#quote').empty();
      $('#like_number').empty();
      $('#dislike_number').empty();

      let quoteLen = response['quotes'].length;

      let chosen = response['quotes'][Math.floor(Math.random() * quoteLen)];
      let quote = chosen['quote'];
      let like = chosen['like'];
      let dislike = chosen['dislike'];

      $('#quote').append(quote);
      $('#like_number').append(like);
      $('#dislike_number').append(dislike);
    },
  });
}

function count(type) {
  const resultElement = document.getElementById('like_number');
  let number = resultElement.innerText;

  const result2Element = document.getElementById('dislike_number');
  let number2 = result2Element.innerText;

  const result3Element = document.getElementById('quote');
  let written = result3Element.innerText;

  if (type === 'plus') {
    number = parseInt(number) + 1;
    resultElement.innerText = number;
    alert('투표 완료 ❕');
  } else if (type === 'minus') {
    number2 = parseInt(number2) - 1;
    result2Element.innerText = number2;
    alert('투표 완료 ❕');
  }

  $.ajax({
    type: 'POST',
    url: '/quote',
    data: { like_give: number, dislike_give: number2, written_give: written },
    success: function (response) {
      console.log(response['msg']);
    },
  });
}
