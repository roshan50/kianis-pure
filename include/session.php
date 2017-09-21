<?php
   session_start();

   if(!isset($_SESSION['login_user'])){
      header("location:/kianis/login.php");
   }else{
       $login_session = $_SESSION['login_user'];
   }
?>
