var
  login = password = false;

$("#login").on('input',function () {
  let val = this.value;
  $("#playername").html(val);
  if(val.length >= 5){
    login = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Логін дуже короткий!')
    login = false;
  }
})

$("#password").on('input',function () {
  let val = this.value;
  password_becup = val;
  if(val.length >= 8){
    password = true;
    $("#erorr").html('')
  }else{
    $("#erorr").html('Пароль дуже короткий! (принаймні 8 символів)')
    password = false;
  }
})

let id = setInterval(function () {
  if(login && password){
    $("#go").removeAttr('disabled');
    $("#go").attr('class', 'login_submit active');
  }else{
    $("#go").attr('disabled', 'disabled');
    $("#go").attr('class', 'login_submit');
  }
}, 100)
