<?php
include "include/db.php";
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


$row_per_page = 10;
if(isset($_POST['page'])){
    $page = $_POST['page'];
    $offset = ($page-1) * $row_per_page;
}else{
    $offset = 0;
    $page = 1;
}
//echo $page;
$where = search_where($_POST['last_name_search'],$_POST['name_search'],$_POST['phone_search']);
if(isset($_POST['sort_col'])){
    $sort_col = $_POST['sort_col'];
}else{
    $sort_col = 'created_at DESC';
}

$Query = "SELECT * FROM users WHERE deleted_at IS NULL $where ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset";
$ExecQuery = MySQLi_query($db, $Query);
//echo $Query; die();
$sql = "SELECT id FROM users WHERE deleted_at IS NULL $where";
$result2 = mysqli_query($db,$sql);
$count = mysqli_num_rows($result2);

$i = 1;
$res = '';
while ($value = MySQLi_fetch_array($ExecQuery)) {
   $id = $value['id'];
   $res .= '<tr>';
   $res .=  "<td scope='row' id='chbxtd'>";
   $res .=  "<div class='checkbox tooltip'>
                            <input type='checkbox' id='check$i' name='users' onclick='add_reffered(this)'>
                            <label for='check$i'></label>
                            <span class='tooltiptext'>اضافه به لیست معرفی ها</span>
                         </div>";
   $res .= "</td>";
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
   $res .=  "<td scope='row' id='buy_cash_td'>";
   $res .= $value['buy_cash'];
   $res .= "</td>";
   $res .=  "<td scope='row' id='buy_2month_td'>";
   $res .= $value['buy_2month'];
   $res .= "</td>";
   $month_passed = ($value['2month_passed']=='f') ? 'پاس نشده' : 'پاس شده';
   $res .=  "<td scope='row' id='month_passed_td'>";
   $res .= $month_passed;
   $res .= "</td>";
   $res .=  "<td scope='row' id='buy_cheque_td'>";
   $res .= $value['buy_cheque'];
   $res .= "</td>";
   $cheque_passed = ($value['cheque_passed']=='f') ? 'پاس نشده' : 'پاس شده';
   $res .=  "<td scope='row' id='cheque_passed_td'>";
   $res .= $cheque_passed;
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
    $res .=  "<td scope='row' id='delTd' class='deleteTd' onclick='soft_delete($id,this)'>";
    $res .= 'حذف';
    $res .= "</td>";
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
