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
$(document).ready(function () {
  show_quote();

  $('#like_button').click(function () {
    $(this).prop("disabled", true);
    $(this).css("cursor", "not-allowed");
  })

  $('#dislike_button').click(function () {
    $(this).prop("disabled", true);
    $(this).css("cursor", "not-allowed")
  })
});

function show_quote() {
  $.ajax({
    type: 'GET',
    url: '/quote',
    data: {},
    success: function (response) {
      let chosen = response['quotes'][Math.floor(Math.random() * 10)]
      let quote = chosen['quote']
      let like = chosen['like']
      let dislike = chosen['dislike']

      $('#quote').append(quote)
      $('#like_number').append(like)
      $('#dislike_number').append(dislike)
      console.log(quote, like, dislike)
    }
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
    alert('투표 완료 ❕')


    // $('#like_button').hide()
    // let disabled_like_button = `<input onclick="count('disabled')" id="disabled_like_button" type="button" class="btn btn-outline-primary" value="Like 👍">`
    //
    // $('#buttons').prepend(disabled_like_button)

  } else if (type === 'minus') {
    number2 = parseInt(number2) - 1;
    result2Element.innerText = number2;
    alert('투표 완료 ❕')

    // $('#dislike_button').hide()
    // let disabled_dislike_button = `<input onclick="count('disabled')" id="dislike_button" type="button" class="btn btn-outline-danger" value="Dislike 👎">`
    //
    // $('#buttons').append(disabled_dislike_button)

  }
  //else if (type === 'disabled') {
  //     alert('중복 투표는 불가능 합니다.. 😓')
  // }

  //*button disabled


  $.ajax({
    type: 'POST',
    url: '/quote',
    data: {like_give: number, dislike_give: number2, written_give: written},
    success: function (response) {
      console.log(response['msg'])
    }
  });
}

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
