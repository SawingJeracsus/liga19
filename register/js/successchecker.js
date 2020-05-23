setInterval(()=>{
  $.ajax({
    url: 'js/check.php',
    type:'GET',
    data:'id='+id,
    success: function(html){
        console.log(html);
        if(html == 1){
          window.location = 'https://google.com'
        }
    }
  })
}, 3000)
