<?php
include("include/db.php");
include("include/lib.php");
include("include/const.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($db, $_POST['name']);
    if ($name == '') {
        $message = "نام الزامی است!";
        echo $message;
        return;
    }
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);
    if ($last_name == '') {
        $message = "نام خانوادگی الزامی است!";
        echo $message;
        return;
    }
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $referred = return_null_if_empty(mysqli_real_escape_string($db, $_POST['referred']));
    $score = return_null_if_empty(mysqli_real_escape_string($db, $_POST['kian_fest_score']));
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    if ($phone == '') {
        $message = "شماره موبایل الزامی است!";
        echo $message;
        return;
    }
    if (check_duplicate($db, 'phone', $phone)) {
        $message = "شماره تلفن تکراریست";
        echo $message;
        return;
    }
    if (strlen($phone) != 11) {
        $message = "شماره تلفن نامعتبر است!";
        echo $message;
        return;
    }
    $gender = mysqli_real_escape_string($db, $_POST['gender']);
    $birth_date = mysqli_real_escape_string($db, $_POST['birth_date'])?mysqli_real_escape_string($db, $_POST['birth_date']):'0000-00-00';
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cash']));
//    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_2month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cheque']));
    $buy_date = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_date']));
    $cheque_passed = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['cheque_passed']));

    $score = 0;//calc_score($buy_cash, $buy_cheque, $referred, $db);
    $sql = "INSERT INTO users (`name`, `last_name`, `password`, `referred`, `score`, `phone`, `gender`,
            `birth_date`, `created_at`,buy_cash,buy_cheque,cheque_passed,buy_date)
            VALUES ('$name','$last_name','$password',  '$referred', $score, '$phone',$gender, 
            '$birth_date', NOW(),'$buy_cash','$buy_cheque','$cheque_passed','$buy_date')";

    if ($db->query($sql) === TRUE) {
        $message = $last_name . " با موفقیت اضافه شد.";
        send_sms($name, $last_name, $password, $phone);
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }


    echo $message;

}

?>