<?php
  $server_user_name = 'root';
  $server_password = '';
  $server_db_name = 'game';
  $server_url='localhost';

  $sitelink = 'http://liga19';
  $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
  $actual_link_parrent = "http://$_SERVER[HTTP_HOST]";

  
  /*++++++++++++++++++++++++++SMRT++++++++++++++++++++++++++++++++*/

  $_SMPT = [
    'host' => 'smtp.gmail.com',
    'username' => 'github.liubeshiv@gmail.com',
    'password' => '!2qazwsx',
    'port' => 587
  ];

  /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

  /* GAME INFO */
  $_GAME = [
    'name' => 'Jailway'
  ];
 ?>
