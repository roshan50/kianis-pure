<?php
include "include/db.php";
function get_passed($pass_stirng){
    $pass_array = explode(',',$pass_stirng);
    $ret_pass_stirng = '';
    foreach ($pass_array as $pa){
        $ret_pass = ($pa == 't')? 'شده' : 'نشده';
        $ret_pass_stirng .= ','. $ret_pass;
    }

    return trim($ret_pass_stirng,',');
}

function get_one_passed($pass_stirng,$i){
    $pass_array = explode(',',$pass_stirng);
    $ret_pass = ($pass_array[$i] == 't')? 'شده' : 'نشده';

    return $ret_pass;
}
function search_where($last_name_search,$name_search,$phone_search){
    $where = '';
//    if($last_name_search) { $and = ($where) ? "AND" : ""; $where.=" $and last_name LIKE '%$last_name_search%'";}
//    if($name_search){ $and = ($where) ? "AND" : ""; $where.=" $and name LIKE '%$name_search%'";}
//    if($phone_search){ $and = ($where) ? "AND" : ""; $where.=" $and phone LIKE '%$phone_search%'";}
//    if($where) $where = "WHERE $where";

    if($last_name_search) {  $where.=" AND last_name LIKE '$last_name_search%'";}
    if($name_search){ $where.=" AND name LIKE '$name_search%'";}
    if($phone_search){ $where.=" AND phone LIKE '$phone_search%'";}

    return $where;
}

function filter_where($case){
    $where = '';

     $buy_where=" (buy_cash != '0' AND (referred = 'NULL' OR referred IS NULL))";//just customer and not refering anyone
     $ref_where=" ((referred != 'NULL' AND referred IS NOT NULL) AND buy_cash = '0')";//just ref somebody and not buying
     $buyRef_where=" (buy_cash != '0' AND (referred != 'NULL' AND referred IS NOT NULL))";//both customer and refer somebody

     switch ($case){//$buy,$ref,$ref_buy
         case '111' : break;
//         case '110' : $where= "($buy_where OR $ref_where)"; break;
//         case '101' : $where= "($buy_where OR $ref_where)";break;
         case '100' : $where= $buy_where;break;
//         case '011' : $where= "($buy_where OR $ref_where)";break;
         case '001' : $where= $buyRef_where;break;
         case '010' : $where= $ref_where;break;
//         case '000' : $where= 0;break;

     }

    if($where) $where=' AND '.$where;
    return $where;
}


$row_per_page = 7;
if(isset($_POST['page'])){
    $page = $_POST['page'];
    $offset = ($page-1) * $row_per_page;
}else{
    $offset = 0;
    $page = 1;
}
//echo $page;
$where = search_where($_POST['last_name_search'],$_POST['name_search'],$_POST['phone_search']);
$filter_where = filter_where($_POST['filter']);
if(isset($_POST['sort_col'])){
    $sort_col = $_POST['sort_col'];
}else{
    $sort_col = 'created_at DESC';
}

$Query = "SELECT * FROM users WHERE deleted_at IS NULL $where $filter_where ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset";
$ExecQuery = MySQLi_query($db, $Query);
//echo $Query; die();
$sql = "SELECT id FROM users WHERE deleted_at IS NULL $where $filter_where";
$result2 = mysqli_query($db,$sql);
$count = mysqli_num_rows($result2);

$i = 1;
$res = '';
while ($value = MySQLi_fetch_array($ExecQuery)) {
   $id = $value['id'];
   $res .= '<tr>';
    $res .=  "<td scope='row' id='chbxtd'>";
    $res .=  "<div class='tooltip'>
                <button class='btn-primary' onclick='add_reffered(this)'>انتخاب</button>
                <span class='tooltiptext'>اضافه به لیست معرفی ها</span>
           </div>";
    $res .= "</td>";
//   $res .=  "<td scope='row' id='chbxtd'>";
//   $res .=  "<div class='checkbox tooltip'>
//                            <input type='checkbox' id='check$i' name='users' onclick='add_reffered(this)'>
//                            <label for='check$i'></label>
//                            <span class='tooltiptext'>اضافه به لیست معرفی ها</span>
//                         </div>";
//   $res .= "</td>";
   $res .=  "<td scope='row' id='numTd'>";
   $res .= $i;
   $res .= "</td>";
    $res .=  "<td scope='row' id='nameTd'>";
    $res .= $value['name'];
    $res .= "</td>";
   $res .=  "<td scope='row' id='lastNameTd'>";
   $res .= $value['last_name'];
   $res .= "</td>";
   $res .=  "<td scope='row' id='phoneTd'>";
   $res .= $value['phone'];
   $res .= "</td>";
   $gender = ($value['gender']==0) ? 'مرد' : 'زن';
   $res .=  "<td scope='row' id='genderTd'>";
   $res .= $gender;
   $res .= "</td>";
   $res .=  "<td scope='row' id='birthTd'>";
   $res .= $value['birth_date'];
   $res .= "</td>";
    $cash = explode(',',$value['buy_cash']);
    $res .=  "<td scope='row' id='select_td'>";
    $res .= "<div id='buyselectionUserTd'>
                 <select id='buyTimeUserTd' onchange='change_user_buy_time(this)'>";
    for($j=1; $j<=count($cash); $j++){
        $res .= "<option value='$j'>$j</option>";
    }
    $res .= "</select></div></td>";
    $cash1 = $value['buy_cash'];
   $res .=  "<td scope='row' id='buy_cash_td' data-val='$cash1'>";
   $res .= $cash[0];
   $res .= "</td>";
    $month = $value['buy_2month'];
    $res .=  "<td scope='row' id='buy_2month_td' data-val='$month'>";
    $month = explode(',',$value['buy_2month']);
    $res .= $month[0];
    $res .= "</td>";
    $month_passed = $value['2month_passed'];
    $mpv = get_passed($month_passed);
    $res .=  "<td scope='row' id='month_passed_td' data-val='$mpv'>";
    $res .= get_one_passed($month_passed,0);
    $res .= "</td>";
    $cheque = $value['buy_cheque'];
    $res .=  "<td scope='row' id='buy_cheque_td' data-val='$cheque'>";
    $cheque = explode(',',$value['buy_cheque']);
    $res .= $cheque[0];
    $res .= "</td>";
    $cheque_passed = $value['cheque_passed'];
    $cpv = get_passed($cheque_passed);
    $res .=  "<td scope='row' id='cheque_passed_td' data-val='$cpv'>";
    $res .= get_one_passed($cheque_passed,0);
    $res .= "</td>";
   $res .=  "<td scope='row' id='referredTd'>";
   $res .= $value['referred'];
   $res .= "</td>";
   $res .=  "<td scope='row' id='scoreTd'>";
   $res .= $value['score'];
   $res .= "</td>";
    $res .=  "<td scope='row' id='editTd'  onclick='showInForm(this)'><a>";
    $res .= 'ویرایش';
    $res .= "</a></td>";
    $res .= "<td scope='row' id='delTd'>";
    $res .= "<div class='deactiveDel'>حذف</div>";// onclick='soft_delete($id,this)'
    $res .= "<div class='checkbox'>
                                    <input type='checkbox' id='check$i' onclick='active_delete(this,$id)'>
                                    <label for='check$i'></label>
                                 </div>";
    $res .= "</td>";
//    $res .=  "<td scope='row' id='delTd' class='deleteTd' onclick='soft_delete($id,this)'>";
//    $res .= 'حذف';
//    $res .= "</td>";
   $res .= '</tr>';
   $i++;
}
$len = $row_per_page - $i;
for($i=0; $i<=$len; $i++){
    $res .= '<tr style="background-color: lightgrey;">
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

// Pagination system
$page_count = ceil($count/$row_per_page);
$prev = $page-1;
$pagination = '';
$pagination .= "<div class='";
if($page != 1) $pagination .= "cell";
else $pagination .= "cell_disabled";
$pagination .="' data-val='1'  onclick='paging(this)'><span>اول</span></div>";
$pagination .= "<div class='";
if($page != 1) $pagination .= "cell";
else $pagination .= "cell_disabled";
$pagination .="' data-val='$prev'  onclick='paging(this)'><span>قبل</span></div>";
$pagination .= "<div class='";
if($page != 1) $pagination .= "cell";
else $pagination .= "cell_active";
$pagination .="' data-val='1'  onclick='paging(this)'><span>1</span></div>";

for ($i=2; $i<=$page_count; $i++) {
    $pagination .= "<div class='";
    if ($i == $page) $pagination .= "cell_active";
    else $pagination .= "cell";
    $pagination .= "' data-val='$i'  onclick='paging(this)'><span>$i</span></div>";
}

$next = $page+1;
$pagination .= "<div class='";
if($page_count > 1 && $page < $page_count) $pagination .= "cell";
else $pagination .= "cell_disabled";
$pagination .="' data-val='$next'  onclick='paging(this)'><span>بعد</span></div>";
$pagination .= "<div class='";
if($page_count > 1 && $page < $page_count) $pagination .= "cell";
else $pagination .= "cell_disabled";
$pagination .="' data-val='$page_count'  onclick='paging(this)'><span>آخر</span></div>";



$list = array(
    "table" => $res,
    "pagination" => $pagination,
    "count" => $Query
);

print json_encode($list);

?>
