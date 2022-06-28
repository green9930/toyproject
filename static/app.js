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
// ===========================================================================팝업
  // 팝업열기
  $(document).on("click", ".todo-list-a", function(e){
    e.preventDefault();
    if($(this).is(".todo-done")){
      $("#edit-input").attr("placeholder",'');
      $("#modify-num").val('');
    }
    $(".todo-pop").css("visibility",'visible');
    modifyResultTF = false;
  });
  // 팝업닫기
  $(".todo-pop .todo-pop-container").on({
    "click":function(e){
      if(e.target==e.currentTarget){
        $(".todo-pop").css("visibility",'hidden');
        if(modifyResultTF){
          window.location.reload();
        }
      }
    }
  })
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
