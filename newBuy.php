<?php
const UNIT_OF_PAYMENT = 1000000;
const _2MONTH_SCORE = 3;
const CASH_SCORE = 5;
const CHEQUE_SCORE = 0;
include("include/db.php");
function return_null_if_empty($user_data)
{
    return ($user_data == "")? "NULL" : $user_data;
}

function return_zero_if_empty($user_data)
{
    if ($user_data == "") {
        $user_data = "0";
    }
    return $user_data;
}

/**
 * @param $buy_cash
 * @param $buy_2month
 * @param $buy_cheque
 * @return mixed
 */
function calc_score($buy_cash, $buy_2month, $buy_cheque)
{
    return cacl_cash_score($buy_cash) + calc_2month_score($buy_2month) + calc_cheque_score($buy_cheque);
}

/**
 * @param $buy_cheque
 * @return mixed
 */
function calc_cheque_score($buy_cheque)
{
    $score = floor($buy_cheque / UNIT_OF_PAYMENT) * CHEQUE_SCORE;
    return $score;
}

/**
 * @param $buy_2month
 * @return mixed
 */
function calc_2month_score($buy_2month)
{
    $score = floor($buy_2month / UNIT_OF_PAYMENT) * _2MONTH_SCORE;
    return $score;
}

/**
 * @param $buy_cash
 * @return mixed
 */
function cacl_cash_score($buy_cash)
{
    $score = floor($buy_cash / UNIT_OF_PAYMENT) * CASH_SCORE;
    return $score;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = mysqli_real_escape_string($db, $_POST['id']);
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['cash']));
    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['cheque']));
    $_2month_passed = 'f';
    $cheque_passed = 'f';

    $select = "SELECT score,buy_cash, buy_2month, buy_cheque,2month_passed,cheque_passed FROM users WHERE id = $id";
    $result = mysqli_query($db, $select);
    $row = $result->fetch_assoc();
    $old_score = $row['score'];
    $cash = $row['buy_cash'] . ',' . $buy_cash;
    $month = $row['buy_2month'] . ',' . $buy_2month;
    $cheque = $row['buy_cheque'] . ',' . $buy_cheque;
    $month_passed = $row['2month_passed'] . ',' . $_2month_passed;
    $cheque_passed = $row['cheque_passed'] . ',' . $cheque_passed;


    $score = $old_score + calc_score($buy_cash, $buy_2month, $buy_cheque);
    $sql = "UPDATE users SET `score` = $score,buy_cash = '$cash',buy_2month = '$month',
            buy_cheque = '$cheque',2month_passed='$month_passed',cheque_passed = '$cheque_passed' WHERE id = $id";


    if ($db->query($sql) === TRUE) {
        $message =  " با موفقیت اضافه شد.";
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }


    echo $message;

}

?>

