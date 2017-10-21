<?php
include("include/db.php");
include("include/lib.php");
include("include/const.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = mysqli_real_escape_string($db, $_POST['id']);
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['cash']));
//    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['cheque']));
//    $_2month_passed = 'f';
    $cheque_passed = 'f';

    $select = "SELECT score,buy_cash, buy_cheque,cheque_passed FROM users WHERE id = $id";
    $result = mysqli_query($db, $select);
    $row = $result->fetch_assoc();
    $old_score = $row['score'];
    $cash = $row['buy_cash'] . ',' . $buy_cash;
//    $month = $row['buy_2month'] . ',' . $buy_2month;
    $cheque = $row['buy_cheque'] . ',' . $buy_cheque;
//    $month_passed = $row['2month_passed'] . ',' . $_2month_passed;
    $cheque_passed = $row['cheque_passed'] . ',' . $cheque_passed;


    $score = $old_score + calc_score($buy_cash, $buy_2month,$_2month_passed, $buy_cheque,'NULL',$db);
    $sql = "UPDATE users SET `score` = $score,buy_cash = '$cash',buy_2month = '$month',
            buy_cheque = '$cheque',2month_passed='$month_passed',cheque_passed = '$cheque_passed' WHERE id = $id";


    if ($db->query($sql) === TRUE) {
        $message =  "خرید جدید با موفقیت اضافه شد.";
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }


    echo $message;

}

?>

