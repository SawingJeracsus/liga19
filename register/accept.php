<?php
require '../db/db.php';
$token = $_GET['token'];

  if($_GET['delete'] == 0){
    R::exec("UPDATE `players` SET `acepted` = 1, `token` = 1 WHERE `token` = '".$token."'");
  }else{
    R::exec("DELETE FROM `players` WHERE `token` = '".$token."'");
  }

 echo "<script>setTimeout(()=>{window.close();}, 3000)</script>";
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Успішне підтвердження</title>
  <link rel="stylesheet" href="css/save.css">
</head>
<body>
  <main>
    <div class="content_wrapper">
        <div class="accept_email">
          <?php if($_GET['delete'] == 0): ?>
            <h1>Через 3 секунди сторінка закриється, перейдіть на сторінку з повідомленням про підвердження email!</h1>
          <?php else: ?>
            <h1>Успішна відміна реєстрації! Через 3 секунди сторінка закриється.</h1>
          <?php endif; ?>
        </div>
    </div>
  </main>
</body>
</html>
