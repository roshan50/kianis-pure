<?php
include("include/db.php");
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = mysqli_real_escape_string($db,$_POST['username']);
    $input_password = mysqli_real_escape_string($db,$_POST['password']);

    $sql = "SELECT id FROM users WHERE phone = '$input_username' and password = '$input_password'";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);

    if($count == 1) {
        $_SESSION['login_user'] = $input_username;
        echo 'true';
    }else {
        echo "Your Login Name or Password is invalid";
    }
}
?>
