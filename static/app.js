/* JS 연결 확인 ----------------------------------------------------------------- */
const test = () => {
  console.log('JavaScript connected!');
};

/* app.js ------------------------------------------------------------------- */
$(document).ready(() => {
  test();
  // 페이지 로딩 후 바로 들어오는 GET 함수는 이곳에서 호출
});

/* BACKGROUND --------------------------------------------------------------- */

/* WEATHER ------------------------------------------------------------------ */

/* CLOCK -------------------------------------------------------------------- */

/* TODOLIST ----------------------------------------------------------------- */

/* QUOTE -------------------------------------------------------------------- */
$(document).ready(function () {
  show_quote();
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

    $('#like_button').hide()
    let disabled_like_button = `<input onclick="count('disabled')" id="disabled_like_button" type="button" class="btn btn-outline-primary" value="Like 👍">`

    $('#buttons').prepend(disabled_like_button)

  } else if (type === 'minus') {
    number2 = parseInt(number2) - 1;
    result2Element.innerText = number2;

    alert('투표 완료 ❕')

    $('#dislike_button').hide()
    let disabled_dislike_button = `<input onclick="count('disabled')" id="dislike_button" type="button" class="btn btn-outline-danger" value="Dislike 👎">`

    $('#buttons').append(disabled_dislike_button)

  } else if (type === 'disabled') {
    alert('중복 투표는 불가능 합니다.. 😓')
  }

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
