<?php
session_start();
$admin_username = 'admin';
$admin_password = 'admin';
$message = '';

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = htmlspecialchars($_POST['username']);
    $input_password = htmlspecialchars($_POST['password']);

    if($input_username == $admin_username){
        if($input_password == $admin_password){
            $_SESSION['login_user'] = $input_username;
            $message = 'true';
        }else{
            $message = 'رمز عبور اشتباه است';
        }
    }else{
        $message = 'نام کاربری اشتباه است';
    }

}

echo $message;
?>