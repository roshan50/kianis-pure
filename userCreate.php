<?php
const UNIT_OF_PAYMENT = 1000000;
const _2MONTH_SCORE = 3;
const CASH_SCORE = 5;
const CHEQUE_SCORE = 0;
include("include/db.php");
function return_null_if_empty($user_data)
{
    return ($user_data == "")? "NULL" : $user_data;
//    if ($user_data == "") {
//        $user_data = "NULL";
//    }
//    return $user_data;
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
    $sql = "SELECT id FROM users WHERE $column_name = '$column_value' AND deleted_at IS NULL";
    $result = mysqli_query($db, $sql);
    $count = mysqli_num_rows($result);

    if ($count > CHEQUE_SCORE)
        $return = true;
    return $return;
}

function send_sms($name, $last_name, $password, $phone)
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

        $sms_content = "کاربر گرامی $name $last_name ، حساب کاربری شما با نام کاربری: '$phone' و رمز عبور: '$password' ایجاد شد.";

//        $sms_content = "کاربر گرامی " . $name . ' ، حساب کاربری شما با نام کاربری: "' . $phone . '" و رمز عبور: "' . $password . '" ایجاد شد';
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
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $referred = return_null_if_empty(mysqli_real_escape_string($db, $_POST['referred']));
    $score = return_null_if_empty(mysqli_real_escape_string($db, $_POST['kian_fest_score']));
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
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
    $birth_date = return_null_if_empty(mysqli_real_escape_string($db, $_POST['birth_date']));
    $buy_cash = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cash']));
    $buy_2month = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_2month']));
    $buy_cheque = return_zero_if_empty(mysqli_real_escape_string($db, $_POST['buy_cheque']));
//    $_2month_passed = isset($_POST['2month_passed']) ? 't' : 'f';
//    $cheque_passed = isset($_POST['cheque_passed']) ? 't' : 'f';
    $_2month_passed = 'f';
    $cheque_passed = 'f';

    $score = calc_score($buy_cash, $buy_2month, $buy_cheque, $referred, $db);
    $sql = "INSERT INTO users (`name`, `last_name`, `password`, `referred`, `score`, `phone`, `gender`,
            `birth_date`, `created_at`,buy_cash,buy_2month,buy_cheque,2month_passed,cheque_passed)
            VALUES ('$name','$last_name','$password',  '$referred', $score, '$phone',$gender, 
            '$birth_date', NOW(),'$buy_cash','$buy_2month','$buy_cheque','$_2month_passed','$cheque_passed')";

    if ($db->query($sql) === TRUE) {
        $message = $last_name . " با موفقیت اضافه شد.";
        send_sms($name, $last_name, $password, $phone);
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }


    echo $message;

}

?>