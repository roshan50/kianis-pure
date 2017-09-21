<html>
<head>
  <link rel="stylesheet" href="css\style.css">
  <meta charset="utf-8"/>
</head>

<body lang="fa" dir="rtl">
  <div class="login-page">
    <div class="container">
      <div class="form-outer text-center d-flex align-items-center">
        <div class="form-inner">
          <div class="logo text-uppercase"><span>ورود به دشبورد</span><strong class="text-primary">کیانیس</strong></div>
          <div id="loading"><img src="images/loading.gif" /></div>
          <form id="login-form">
            <div class="form-group">
              <label for="login-username" class="label-custom">نام کاربری</label>
              <input id="login-username" type="text" name="username" required="">
            </div>
            <div class="form-group">
              <label for="login-password" class="label-custom">رمز عبور</label>
              <input id="login-password" type="password" name="password" required="">
            </div>
             <div id="message"></div>
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


    $('#login-form').submit(function(event) {
        $.ajax({
            type: 'post',
            url: 'adminLogin.php',
            data: $('#login-form').serialize(),
            beforeSend: function() {
                $("#loading").css("display","block");
            },
            success: function (data) {
                document.getElementById("message").innerHTML = data;
                if(data == 'true') location.href = "index.php";
                $("#loading").css("display","none");
            }
        });
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });
});
</script>

<style>
    #loading{
        display: none;
        z-index: 99;
        position: absolute;
        margin-right: 122px;
        opacity: 0.8;
        top: 75px;
    }

    #message{
        color: red;
        margin-top: 5px;
    }

</style>