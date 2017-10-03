<?php
include("include/db.php");
include("include/lib.php");
include("include/const.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);
//    $password = mysqli_real_escape_string($db, $_POST['password']);
    $referred = return_null_if_empty(mysqli_real_escape_string($db, $_POST['referred']));
    $score = return_null_if_empty(mysqli_real_escape_string($db, $_POST['kian_fest_score']));
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    if (check_update_duplicate($db, 'phone', $phone,$id)) {
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

    $selectedBuy = mysqli_real_escape_string($db, $_POST['selectedBuy'])-1;
    $birth_date = return_null_if_empty(mysqli_real_escape_string($db, $_POST['birth_date']));
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cash']));
    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_2month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cheque']));
    $_2month_passed = isset($_POST['2month_passed']) ? 't' : 'f';
    $cheque_passed = isset($_POST['cheque_passed']) ? 't' : 'f';

    $select = "SELECT buy_cash, buy_2month, buy_cheque,2month_passed,cheque_passed FROM users WHERE id = $id";
    $result = mysqli_query($db, $select);
    foreach ($result as $key => $value) {
        $buy_cash   = update_inside_string($value['buy_cash'],$selectedBuy,$buy_cash);
        $buy_2month = update_inside_string($value['buy_2month'],$selectedBuy,$buy_2month);
        $buy_cheque = update_inside_string($value['buy_cheque'],$selectedBuy,$buy_cheque);
        $_2month_passed = update_inside_string($value['2month_passed'],$selectedBuy,$_2month_passed);
        $cheque_passed  = update_inside_string($value['cheque_passed'],$selectedBuy,$cheque_passed);

        $score = calc_update_score($buy_cash, $buy_2month, $buy_cheque, $referred, $db);
    }



    $sql = "UPDATE users SET `name`='$name' , `last_name`= '$last_name', `referred` = '$referred', `score` = $score, `phone` = '$phone', `gender`=$gender,
            `birth_date`='$birth_date',buy_cash = '$buy_cash',buy_2month = '$buy_2month',buy_cheque = '$buy_cheque',2month_passed='$_2month_passed',cheque_passed = '$cheque_passed' WHERE id = $id";

    if ($db->query($sql) === TRUE) {
        $message = $last_name . " با موفقیت تغییر یافت.";
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }

    echo $message;
}


function update_inside_string($str,$index,$newVal){
    $array = explode(",", $str);
    $array[$index] = $newVal;
    return implode(',',$array);
}

?>