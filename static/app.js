/* JS 연결 확인 ----------------------------------------------------------------- */
const test = () => {
  console.log('JavaScript connected!');
};

/* app.js ------------------------------------------------------------------- */
$(document).ready(() => {
  // 페이지 로딩 후 바로 들어오는 GET 함수는 이곳에서 호출
  test();
  // 배경화면 호출
  backgroundInit();

  // =========================================================================todo 리스트를 꺼내 나열
  getTodoList();
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
// 위도, 경도를 알아 내는 함수
function onGeoSucess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log('위치정보를 확인하였습니다.', lat, lon);
}
// navigator.geolocation error 시 작동하는 함수
function onGeoError() {
  alert('위치정보를 확인할 수 없습니다.');
}
// 위치정보 허용을 물어보는 함수
navigator.geolocation.getCurrentPosition(onGeoSucess, onGeoError); // sucess 시, 첫번째 인수 실행 / error 시, 두번째 인수 실행

function getWeather() {
  // API key 변수
  const APIKEY = '5cedb12d7cfe681080f2af92fcdf062c';
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
  // 날씨 API url
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.5503563&lon=127.0952986&appid=${APIKEY}&units=metric`;
  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: function (response) {
      const temp = response['main']['temp'];
      const city = response['name'];
      const des = response['weather'][0]['description'];
      console.log(temp);
      $('.weather01').text(temp);
      $('.weather02').text(city);
      $('.weather03').text(des);
    },
  });
}

getWeather();
/* CLOCK -------------------------------------------------------------------- */
// 우선 html에서 Element를 자바스크립트로 가져온다.
const clock = document.querySelector('.clock'); // class는 .을 찍어야한다.

function getClock() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  clock.innerText = `${hours}:${minutes}`;
}

getClock();
setInterval(getClock, 1000);

/* TODOLIST ----------------------------------------------------------------- */

/* TODO POPUP --------------------------------------------------------------- */
// 팝업열기
$(document).on('click','.todo-list-a',function(e){
  e.preventDefault();
  if ($(this).is('.todo-done-text')) {
    $('#edit-input').attr('placeholder', '');
    $('.modify-num').val('');
  }
  $('.todo-pop').css('visibility', 'visible');
});
// 팝업닫기
$(document).on('click','.todo-pop-container',function(e){
  if (e.target === e.currentTarget) {
    $('.todo-pop').css('visibility', 'hidden');
  }
});

// ===========================================================================todo 글 입력 엔터
  // input에서 엔터
  $('#add-input').on({
    onkeyup(e){
      if(e.keyCode===13){
        todoWriteAction();
      }
    }
  })
// ================================================================================== todo 글 작성 액션
function todoWriteAction(){
  let $todo = $("#add-input").val();
  if($.trim($todo) === ""){
    $("#add-input").focus();
    alert("Please enter your to-do list.");
    return false;
  }
  console.log(Date.now());
  $.ajax({
    url: './todoWriteAction',
    type: 'POST',
    data: {togoVal:$todo, doneVal:0, numVal:Date.now()},
    success: function (result) {
      alert(result.msg);
      getTodoList();
    },complete:function(){
      $('.todo-input').val('').focus();
    }
  })
}

// ================================================================================== todo글 불러냄
let arr = []; /* 팝업에 뿌려주려고*/
function getTodoList(){
  arr=[];
  $.ajax({
    url:'./getTodoList',
    type:'GET',
    success:function(result){
      $(".todo-list-ul").empty();
      let temp_html = '';
      let rows = result.msg;
      if(rows.length>=10){
        $('#add-input').prop("disabled",true).val("You can create up to 10 to-do lists per day.").css({'color':'red',"fontSize":'18px'});
        $(".todo-enter").prop("disabled",true).css("cursor",'not-allowed');
      }else{
        $('#add-input').prop("disabled",false).val("").css({'color':'#fff',"fontSize":'14px'});
        $(".todo-enter").prop("disabled",false);
      }
      for(let i=0; i<rows.length; i++){
        let todo    = rows[i].todo
        let num     = rows[i].num
        let done    = rows[i].done
        let dic     = {"todo":todo,"num":num,"done":done}
        arr.push(dic);
        temp_html = ``
        if(Number(done) === 0){
          temp_html+=`<li>
                          <span class="todo-list-a" onclick="todoDetail(this)" data-num="${num}">${todo}</span>
                      </li>`
        }else{
          temp_html+=`<li>
                          <span class="todo-list-a todo-done-text" onclick="todoDetail(this)">${todo}</span>
                      </li>`
        }
        $(".todo-list-ul").append(temp_html)
      }
    }
  })
}

// ================================================================================== 팝업에 글 뿌림
function todoDetail(obj){
  let txt = $(obj).text();
  let num = $(obj).data("num");
  $("#edit-input").attr("placeholder",txt).val('');
  $(".modify-num").val(num);
  console.log("들어갔나:",arr);
  $(".todo-content-list ul").empty();
  arr.map(function(val,index){
    let todo  = val.todo
    let num   = val.num
    let done  = val.done
    let temp_html = ``;
    if(done === 0){
      temp_html = `<li><input type="checkbox" data-num="${num}" class="todo-chk-situation"/><span>${todo}</span><button class="delBtn" data-num="${num}">delete</button><button class="editBtn" data-num="${num}">edit</button></li>`;
    }else{
      temp_html = `<li><input type="checkbox" data-num="${num}" checked class="todo-chk-situation"/><span class="todo-done-text">${todo}</span><button class="delBtn" data-num="${num}">delete</button><button class="editBtn" disabled>edit</button></li>`
    }
    $(".todo-content-list ul").append(temp_html);
  })
}

//팝업의 edit버튼을 누름
  $(document).on('click','.editBtn',function(e){
    let num = $(this).data("num");
    let txt = $(this).prev().prev().text();
    $(".modify-num").val(num);
    $("#edit-input").attr("placeholder",txt).val('').focus();
  })

  // 팝업에 modify눌렀을 때
  $(".modify-btn").on({
    click(){
      modifyAction();
    }
  })

function modifyAction(){
  let $editInput = $("#edit-input");
  if($editInput.val() === ''){
    alert('변경할 내용을 입력해주세요.');
    $editInput.focus();
    return false;
  }
  $.ajax({
    url:'./todoModify',
    type:'post',
    data:{modiData:$editInput.val(), modiNum:$(".modify-num").val()},
    success:function(result){
      console.log("modifyAction->",result);
    },
    complete:function(){
      for(let i=0; i<arr.length; i++){
        if(arr[i].num === $(".modify-num").val()){
          arr[i].todo = $editInput.val();
          $(".todo-content-list ul li:eq("+i+") span").text($editInput.val());
        }
      }
      getTodoList();
    }
  })
}

  // 팝업에 delete눌렀을 때
  $(document).on('click','.delBtn',function(e){
    if (confirm('삭제하시겠습니까?')) {
      deleteAction($(this));
    }
  })

function deleteAction(obj){
  let $obj = obj;
  console.log($obj.data('num'));
  $.ajax({
    url:'./deleteAction',
    type:"post",
    data:{todoNum:$obj.data('num')},
    success:function(result){
      for(let i=0; i<arr.length; i++){
        if(Number(arr[i].num) === Number($obj.data('num'))){
          arr.splice(i,1);
          $(".todo-content-list ul li:eq("+i+")").remove();
        }
      }
      $("#edit-input, .modify-num").val('').attr('placeholder','');
    },complete:function(){
      getTodoList();
    }
  })
}

// 팝업에 상태 이모지 토글로 만들기
$(document).on('change','.todo-chk-situation',function() {
  $(this).next('span').toggleClass('todo-done-text');
  const num = $(this).data('num');
  if ($(this).prop('checked')) {
    //true
    $(this).nextAll('button:eq(1)').prop("disabled", true);
    $("#edit-input, .modify-num").val('').attr('placeholder','');
    todoDoneAction(num, 1);
  } else {
    //false
    $(this).nextAll('button:eq(1)').prop("disabled", false);
    todoDoneAction(num, 0);
  }
})

function todoDoneAction(num,tf){
  console.log("응->",num,tf);
  $.ajax({
    url:'./todoDoneAction',
    type:'post',
    data:{doneNum:num, doneFT:tf},
    success:function(result){
    },
    complete:function(){
      getTodoList();
    }
  })
}





/* QUOTE -------------------------------------------------------------------- */

/* DB TEST ------------------------------------------------------------------ */
const dbTestPost = () => {
  // input 입력 내용
  let text = $('.dbtest-input').val();
  console.log(text);
  $.ajax({
    type: 'POST',
    url: '/dbtest',
    data: { text_give: text },
    success: (res) => {
      alert(res['msg']);
    },
  });
};
