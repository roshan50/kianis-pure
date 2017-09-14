<?php

   include("include/db.php");
   session_start();
   if($_SERVER["REQUEST_METHOD"] == "POST") {
      // username and password sent from form

      $myusername = mysqli_real_escape_string($db,$_POST['username']);
      $mypassword = mysqli_real_escape_string($db,$_POST['password']);

      $sql = "SELECT id FROM users WHERE username = '$myusername' and password = '$mypassword'";
      $result = mysqli_query($db,$sql);
      $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

      $count = mysqli_num_rows($result);
      // If result matched $myusername and $mypassword, table row must be 1 row

      if($count == 1) {
         $_SESSION['myusername']= "myusername";
         $_SESSION['login_user'] = $myusername;

//         echo 'true';
         header("location: index.php");
      }else {
         $error = "Your Login Name or Password is invalid";
      }
   }
?>

<html>
<head>
  <link rel="stylesheet" href="css\style.css">
<!--  <link rel="stylesheet" href="css\login.css">-->
  <meta charset="utf-8"/>
</head>

<body lang="fa" dir="rtl">
  <div class="page login-page">
    <div class="container">
      <div class="form-outer text-center d-flex align-items-center">
        <div class="form-inner">
          <div class="logo text-uppercase"><span>ورود به دشبورد</span><strong class="text-primary">کیانیس</strong></div>
          <form id="login-form" method="post"  action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
            <div class="form-group">
              <label for="login-username" class="label-custom">نام کاربری</label>
              <input id="login-username" type="text" name="username" required="">
            </div>
            <div class="form-group">
              <label for="login-password" class="label-custom">رمز عبور</label>
              <input id="login-password" type="password" name="password" required="">
            </div>
            <button class = "btn btn-lg btn-primary btn-block" type = "submit"
               name = "login">ورود</button>
          </form>
        </div>

      </div>
    </div>
  </div>


  </html>
<script type="text/javascript" src="js/google-ajax.js"></script>
<script>
 // ------------------------------------------------------- //
 // Transition Placeholders
 // ------------------------------------------------------ //
$(document).ready(function() {
    $('input').on('focus', function () {
        $(this).siblings('.label-custom').addClass('active');
    });

    $('input').on('blur', function () {
        $(this).siblings('.label-custom').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-custom').addClass('active');
        } else {
            $(this).siblings('.label-custom').removeClass('active');
        }
    });
});
</script>