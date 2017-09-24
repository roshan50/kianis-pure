<?php
const UNIT_OF_PAYMENT = 1000000;
const _2MONTH_SCORE = 3;
const CASH_SCORE = 5;
const CHEQUE_SCORE = 0;
include("include/db.php");
function return_null_if_empty($user_data)
{
    if ($user_data == "") {
        $user_data = "NULL";
    }
    return $user_data;
}

function return_zero_if_empty($user_data)
{
    if ($user_data == "") {
        $user_data = "0";
    }
    return $user_data;
}

function check_duplicate($db, $column_name, $column_value,$and)
{
    $return = false;
    $sql = "SELECT id FROM users WHERE $column_name = '$column_value' $and AND deleted_at IS NULL";
    $result = mysqli_query($db, $sql);
    $count = mysqli_num_rows($result);

    if ($count > CHEQUE_SCORE)
        $return = true;
    return $return;
}

/**
 * @param $buy_cash
 * @param $buy_2month
 * @param $buy_cheque
 * @return mixed
 */
function calc_score($buy_cash, $buy_2month, $buy_cheque, $referred, $db)
{
    $score = cacl_cash_score($buy_cash) + calc_2month_score($buy_2month) + calc_cheque_score($buy_cheque);
    if($referred != 'NULL') {
        $refer_score = calc_referred_score($referred, $db);
    }else{
        $refer_score = 0;
    }
    return ($score + $refer_score);
}

/**
 * @param $referred
 * @return mixed
 */
function calc_referred_score($referred, $db)
{
    $summed_score = 0;
    $referred_array = explode(",", $referred);
    foreach ($referred_array as $single_referred) {
        $single_score = 0;
        $single_id = substr($single_referred,1,strpos($single_referred, '-')-1);
//        echo $single_referred;
        $sql = "SELECT buy_cash, buy_2month, buy_cheque FROM users WHERE id = $single_id";
        $result = mysqli_query($db, $sql);
        foreach ($result as $key => $value) {
            $single_score =  cacl_cash_score((int)$value['buy_cash']);
            $single_score +=  cacl_cash_score((int)$value['buy_2month']);
            $single_score +=  cacl_cash_score((int)$value['buy_cheque']);
        }
        $summed_score = $summed_score + $single_score;
    }
    return $summed_score;
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
    $id = $_POST['id'];
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);
//    $password = mysqli_real_escape_string($db, $_POST['password']);
    $referred = return_null_if_empty(mysqli_real_escape_string($db, $_POST['referred']));
    $score = return_null_if_empty(mysqli_real_escape_string($db, $_POST['kian_fest_score']));
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    if (check_duplicate($db, 'phone', $phone,' AND id <> '.$id)) {
        $message = "شماره تلفن تکراریست";
        echo $message;
        return;
    }
    if (strlen($phone)) {
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

    $score = calc_score($buy_cash, $buy_2month, $buy_cheque, $referred, $db);

    $select = "SELECT buy_cash, buy_2month, buy_cheque,2month_passed,cheque_passed FROM users WHERE id = $id";
    $result = mysqli_query($db, $select);
    foreach ($result as $key => $value) {
        $buy_cash   = update_inside_string($value['buy_cash'],$selectedBuy,$buy_cash);
        $buy_2month = update_inside_string($value['buy_2month'],$selectedBuy,$buy_2month);
        $buy_cheque = update_inside_string($value['buy_cheque'],$selectedBuy,$buy_cheque);
        $_2month_passed = update_inside_string($value['2month_passed'],$selectedBuy,$_2month_passed);
        $cheque_passed  = update_inside_string($value['cheque_passed'],$selectedBuy,$cheque_passed);

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
    return implode($array,',');
}

?>