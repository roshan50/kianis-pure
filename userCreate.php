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

function check_duplicate($db, $column_name, $column_value)
{
    $return = false;
    $sql = "SELECT id FROM users WHERE $column_name = '$column_value'";
    $result = mysqli_query($db, $sql);
//    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);

    if ($count > CHEQUE_SCORE)
        $return = true;
    return $return;
}

function send_sms($name, $username, $password, $phone)
{
    require 'sms_helper.php';

    try {
        date_default_timezone_set("Asia/Tehran");

        // your sms.ir panel configuration
        $APIKey = "685fd62b729f33e226e7a7a2";
        $SecretKey = "smjmn";
        $LineNumber = "10000038700241";

        // your mobile numbers
        $MobileNumbers = array($phone);

        $sms_content = "کاربر گرامی " . $name . ' ، حساب کاربری شما با نام کاربری: "' . $username . '" و رمز عبور: "' . $password . '" ایجاد شد';
        // your text messages
        $Messages = array($sms_content);

        // sending date
        @$SendDateTime = date("Y-m-d") . "T" . date("H:i:s");

        $SmsIR_SendMessage = new SmsIR_SendMessage($APIKey, $SecretKey, $LineNumber);
        $SendMessage = $SmsIR_SendMessage->SendMessage($MobileNumbers, $Messages, $SendDateTime);
//        var_dump($SendMessage);

    } catch (Exeption $e) {
        echo 'Error SendMessage : ' . $e->getMessage();
    }
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
    $refer_score = calc_referred_score($referred, $db);
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
        echo $single_referred;
        $sql = "SELECT buy_cash, buy_2month, buy_cheque FROM users WHERE username = '$single_referred'";
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
    $score = ($buy_cheque / UNIT_OF_PAYMENT) * CHEQUE_SCORE;
    return $score;
}

/**
 * @param $buy_2month
 * @return mixed
 */
function calc_2month_score($buy_2month)
{
    $score = ($buy_2month / UNIT_OF_PAYMENT) * _2MONTH_SCORE;
    return $score;
}

/**
 * @param $buy_cash
 * @return mixed
 */
function cacl_cash_score($buy_cash)
{
    $score = ($buy_cash / UNIT_OF_PAYMENT) * CASH_SCORE;
    return $score;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $username = mysqli_real_escape_string($db, $_POST['username']);
    if (check_duplicate($db, 'username', $username)) {
        $message = "کاربر تکراریست";
        return;
    }
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $referred = return_null_if_empty(mysqli_real_escape_string($db, $_POST['referred']));
    $score = return_null_if_empty(mysqli_real_escape_string($db, $_POST['kian_fest_score']));
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    if (check_duplicate($db, 'phone', $phone)) {
        $message = "شماره تلفن تکراریست";
        return;
    }
    $gender = mysqli_real_escape_string($db, $_POST['gender']);
    $birth_date = return_null_if_empty(mysqli_real_escape_string($db, $_POST['birth_date']));
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cash']));
    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_2month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cheque']));
    $_2month_passed = isset($_POST['2month_passed']) ? 't' : 'f';
    $cheque_passed = isset($_POST['cheque_passed']) ? 't' : 'f';


    $score = calc_score($buy_cash, $buy_2month, $buy_cheque, $referred, $db);
    $sql = "INSERT INTO users (`name`, `username`, `password`, `referred`, `score`, `phone`, `gender`,
            `birth_date`, `created_at`,buy_cash,buy_2month,buy_cheque,2month_passed,cheque_passed)
            VALUES ('$name','$username','$password',  '$referred', $score, '$phone',$gender, 
            '$birth_date', NOW(),'$buy_cash','$buy_2month','$buy_cheque','$_2month_passed','$cheque_passed')";

    if ($db->query($sql) === TRUE) {
        $message = $username . " با موفقیت اضافه شد.";
//        send_sms($name, $username, $password, $phone);
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }


    echo $message;

}

?>