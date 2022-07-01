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
  // 위치정보 호출
  geoStart();
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
function onGeoSuccess(position){
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const API_KEY = "5cedb12d7cfe681080f2af92fcdf062c";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: (res) => {
      const temp = res['main']['temp'];
      const city = res['name'];
      const dec = res['weather'][0]['main'];
      $('.weather01').text(temp);
      $('.weather02').text(city);
      $('.weather03').text(dec);
    },
  });
}
function onGeoError(){
  alert("위치 정보를 받을 수 없습니다.")
}
function geoStart(){
navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}
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
$('.todo-list-a').on('click', function (e) {
  e.preventDefault();
  if ($(this).is('.todo-done')) {
    $('#edit-input').attr('placeholder', '');
    $('.modify-num').val('');
  }
  $('.todo-pop').css('visibility', 'visible');
  modifyResultTF = false;
});
// 팝업닫기
$('.todo-pop-container').on('click', function (e) {
  if (e.target === e.currentTarget) {
    $('.todo-pop').css('visibility', 'hidden');
    if (modifyResultTF) {
      window.location.reload();
    }
  }
});

/* QUOTE -------------------------------------------------------------------- */

/* DB TEST ------------------------------------------------------------------ */
const dbTestPost = () => {
  // input 입력 내용
  let text = $('.dbtest-input').val();
  console.log(text);
  $.ajax({
    type: 'POST',
    url: '/dbtest',
    data: {text_give: text},
    success: (res) => {
      alert(res['msg']);
    },
  });
};
