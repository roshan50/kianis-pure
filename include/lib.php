<?php
function return_null_if_empty($user_data)
{
    return ($user_data == "")? "NULL" : $user_data;
}

function return_zero_if_empty($user_data)
{
    return ($user_data == "")? "0" : $user_data;
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

function check_update_duplicate($db, $column_name, $column_value,$id)
{
    $return = false;
    $sql = "SELECT id FROM users WHERE $column_name = '$column_value' AND deleted_at IS NULL AND id <> $id";
    $result = mysqli_query($db, $sql);
    $count = mysqli_num_rows($result);

    if ($count > CHEQUE_SCORE)
        $return = true;
    return $return;
}

function send_sms($name, $last_name, $password, $phone)
{
    $apkURL = "http://kianis.ir/kianiss.apk";
    $apkURL_Msg = " لینک دانلود نرم افزار: " . $apkURL;
    $sms_content = "کاربر گرامی $name $last_name ، حساب کاربری شما با نام کاربری: '$phone' و رمز عبور: '$password' ایجاد شد. $apkURL_Msg";

    $url = "37.130.202.188/services.jspd";

    $rcpt_nm = array($phone);
    $param = array
    (
        'uname'=>'lemon',
        'pass'=>'8535343',
        'from'=>'+98100020400',
        'message'=>$sms_content,
        'to'=>json_encode($rcpt_nm),
        'op'=>'send'
    );

    $handler = curl_init($url);
    curl_setopt($handler, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($handler, CURLOPT_POSTFIELDS, $param);
    curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
    $response2 = curl_exec($handler);

    $response2 = json_decode($response2);
    $res_code = $response2[0];
    $res_data = $response2[1];


    return $res_data;
}
//..............................................................................................
/**
 * @param $buy_cash
 * @param $buy_2month
 * @param $buy_cheque
 * @return mixed
 */
function calc_score($buy_cash, $buy_2month,$month_passed, $buy_cheque, $referred, $db)
{
    //check if 1 month and 1 day passed after festival start, do not calt 2 month score!!!
    $festival_start_date = strtotime("October 07");
    $time_after_festival = floor((time()-$festival_start_date)/(60*60*24));
    $deadLine_flag = ($time_after_festival > 31) ? false : true;

    $score = calc_cash_score($buy_cash) + calc_cheque_score($buy_cheque);
    if($referred != 'NULL') {
        $refer_score = calc_referred_score($referred, $db);
    }else{
        $refer_score = 0;
    }
    return ($score + $refer_score);
}

/**
 * @param $buy_cash
 * @param $buy_2month
 * @param $buy_cheque
 * @return mixed
 */
function calc_update_score($buy_cashs, $buy_2months,$month_passeds, $buy_cheques, $referred, $db)
{
    $buy_cashs = explode(",", $buy_cashs);
//    $buy_2months = explode(",", $buy_2months);
    $buy_cheques = explode(",", $buy_cheques);
    $month_passeds = explode(",", $month_passeds);

    $score = 0;
    for($i=0; $i<count($buy_cashs); $i++){
        $score += calc_cash_score($buy_cashs[$i])
//            + calc_2month_score($buy_2months[$i],$month_passeds[$i],true)
            + calc_cheque_score($buy_cheques[$i]);
    }

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
        $single_buy_time =  substr($single_referred,strpos($single_referred, '-')+1,(strpos($single_referred, '}')-strpos($single_referred, '-')-1));
//        echo $single_buy_time;
        $sql = "SELECT buy_cash, buy_cheque FROM users WHERE id = $single_id";
        $result = mysqli_query($db, $sql);
        foreach ($result as $key => $value) {
            $cashs   = explode(',',$value['buy_cash']);
//            $months  = explode(',',$value['buy_2month']);
            $cheques = explode(',',$value['buy_cheque']);

            for($i = 0; $i < count($cashs); $i++){
                if(($i+1) == $single_buy_time){
                    $single_score =  calc_cash_score((int)$cashs[$i]);
//                    $single_score +=  calc_cash_score((int)$months[$i]);
                    $single_score +=  calc_cash_score((int)$cheques[$i]);
                }
            }
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
//function calc_2month_score($buy_2month,$month_passed,$deadLine_flag)
//{//if deadLine_flag is false, 2 month score is time out
//    $score = ($month_passed == 'f' && $deadLine_flag) ? floor($buy_2month / UNIT_OF_PAYMENT) * _2MONTH_SCORE : 0;
//    return $score;
//}

/**
 * @param $buy_cash
 * @return mixed
 */
function calc_cash_score($buy_cash)
{
    $score = floor($buy_cash / UNIT_OF_PAYMENT) * CASH_SCORE;
    return $score;
}
//......................................................................................................................
function get_passed($pass_stirng){
    $pass_stirng = str_replace("f","نخورده",$pass_stirng);
    $pass_stirng = str_replace("t","خورده",$pass_stirng);

    return $pass_stirng;
}

function get_one_passed($pass_stirng,$i,$j){
    $pass_array = explode(',',$pass_stirng);
    $pass_array = explode('-',$pass_array[$i]);
    $ret_pass = ($pass_array[$j] == 't')? 'خورده' : 'نخورده';

    return $ret_pass;
}

function get_sum_buy($cash_arr,$cheque_arr){
    $sum = 0;
    for($i = 0; $i < count($cash_arr); $i++){
        $sum += (int)$cash_arr[$i] + (int)$cheque_arr[$i];
    }
    return $sum;
}

function put_cama_for_money($string){
    $reverse_string='';
    for ($i = strlen($string)-1; $i >= 0; $i--){
        $char = substr( $string, $i, 1 );
        $reverse_string .= $char;
    }

    $cama_string = '';
    for ($i = 0; $i < strlen($reverse_string); $i++){
        $char = substr( $reverse_string, $i, 1 );
        if($i % 3 == 0 && $i != 0){
            $cama_string .= ',';
        }
        $cama_string .= $char;
    }
    $reverse_string='';
    for ($i = strlen($cama_string)-1; $i >= 0; $i--){
        $char = substr( $cama_string, $i, 1 );
        $reverse_string .= $char;
    }

    return $reverse_string;
}

function get_users_list($query_result,$row_per_page,$selected_id,$page){
    $rows = '';
    $i = 1;
    foreach ($query_result as $key => $value) {
        $id = $value['id'];
        $gender = ($value['gender']==0) ? 'مرد' : 'زن';

        $cash = $value['buy_cash'];
        $cheque = $value['buy_cheque'];
        $buy_date = $value['buy_date'];



        $cash_arr = explode(',',$cash);
        $len = (($cash=='0' && $cheque=='0') || (!$cash && !$cheque)) ? 0 : count($cash_arr);


        $cheque_arr = explode(',',$cheque);
        $cheque_arr2 = explode('-',$cheque_arr[0]);
        $buy_date_arr = explode(',',$buy_date);
        $cheque_date_arr2 = explode('-',$buy_date_arr[0]);
        $chequelen = (($cheque=='0') || (!$cheque)) ? 0 : count($cheque_arr2);


        $cheque_passed = $value['cheque_passed'];
        $cpv = get_passed($cheque_passed);

        $sum = get_sum_buy($cash_arr,$cheque_arr);

        $rows .= "<tr data-id='$id'";
        if($id == $selected_id) $rows.="class='gray_row'";
        $rows .= ">";
        $rows .=  "<td scope='row' id='chbxtd'>";
        $rows .=  "<div class='tooltip'>
                                    <button class='btn-primary' onclick='add_reffered(this)'";
        if($id == $selected_id) $rows.="disabled style='cursor:default;'";
        $rows .= ">انتخاب</button>
                                    <span class='tooltiptext'>اضافه به لیست معرفی ها</span>
                                 </div>";
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='numTd'>";
        $rows .= $i+($page-1)*$row_per_page;
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='nameTd'>";
        $rows .= $value['name'];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='lastNameTd'>";
        $rows .= $value['last_name'];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='phoneTd'>";
        $rows .= $value['phone'];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='genderTd'>";
        $rows .= $gender;
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='birthTd'>";
        $rows .= $value['birth_date'];
        $rows .= "</td>";

        $rows .=  "<td scope='row' id='select_td'>";
        $rows .= "<div id='buyselectionUserTd'>
                 <select id='buyTimeUserTd' onchange='change_user_buy_time(this)'>";
        for($j=1; $j<=$len; $j++){
            $rows .= "<option value='$j'>$j</option>";
        }
        $rows .= "</select></div></td>";
        $rows .=  "<td scope='row' id='buy_cash_td' data-val='$cash'>";
        $rows .= ($cash=='0' && $cheque=='0')? '' :number_format((int)$cash_arr[0]);
        $rows .= "</td>";

        $rows .=  "<td scope='row' id='cheque_select_td'>";
        $rows .= "<div id='chequeselectionUserTd'>
                 <select id='chequeTimeUserTd' onchange='change_cheque_buy(this)'>";
        for($j=1; $j<=$chequelen; $j++){
            $rows .= "<option value='$j'>$j</option>";
        }
        $rows .= "</select></div></td>";
        $rows .=  "<td scope='row' id='buy_cheque_td' data-val='$cheque'>";
        $rows .= ($cash=='0' && $cheque=='0')? '' :number_format((int)$cheque_arr2[0]);
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='buy_date_td' data-val='$buy_date'>";
        $rows .= $cheque_date_arr2[0];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='cheque_passed_td' data-val='$cpv'>";
        $rows .= get_one_passed($cheque_passed,0,0);
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='sumTd'>";
        $rows .= number_format($sum);//put_cama_for_money($sum);
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='referredTd'>";
        $rows .= $value['referred'];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='scoreTd'>";
        $rows .= $value['score'];
        $rows .= "</td>";
        $rows .=  "<td scope='row' id='editTd'  onclick='make_ready_for_edit(this)'><a>"; //class='username'
        $rows .= 'ویرایش';
        $rows .= "</a></td>";
        $rows .= "<td scope='row' id='delTd'>";
        $rows .= "<div class='deactiveDel'>حذف</div>";// onclick='soft_delete($id,this)'
        $rows .= "<div class='checkbox'>
                                    <input type='checkbox' id='check$i' onclick='active_delete(this,$id)'>
                                    <label for='check$i'></label>
                                 </div>";
        $rows .= "</td>";
        $rows .= '</tr>';
        $i++;
    }

    $len = $row_per_page - $i;
    for($i=0; $i<=$len; $i++){
        $rows .= '<tr  class="empty-row">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                </tr>';
    }

    return $rows;
}
?>