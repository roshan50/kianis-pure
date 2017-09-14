<?php
include "include/db.php";
function search_where($username_search,$name_search,$phone_search){
    $where = '';
    if($username_search) $where = "username LIKE '%$username_search%'";
    if($name_search){ if($where) $and = "AND"; else $and = ""; $where.=" $and name LIKE '%$name_search%'";}
    if($phone_search){ if($where) $and = "AND";else $and = ""; $where.=" $and phone LIKE '%$phone_search%'";}
    if($where) $where = "WHERE $where";
    return $where;
}


$row_per_page = 5;
if(isset($_POST['page'])){
    $page = $_POST['page'];
    $offset = ($page-1) * $row_per_page;
}else{
    $offset = 0;
    $page = 1;
}
//echo $page;
$where = search_where($_POST['username_search'],$_POST['name_search'],$_POST['phone_search']);
if(isset($_POST['sort_col'])){
    $sort_col = $_POST['sort_col'];
}else{
    $sort_col = 'created_at DESC';
}

$Query = "SELECT * FROM users $where ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset";
$ExecQuery = MySQLi_query($db, $Query);

$sql2 = "SELECT id FROM users $where";
$result2 = mysqli_query($db,$sql2);
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
   $res .=  "<td scope='row' class='username' onclick='showInForm(this)'><a>";
   $res .= $value['username'];
   $res .= "</a></td>";
   $res .=  "<td scope='row' id='nameTd'>";
   $res .= $value['name'];
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
    $res .=  "<td scope='row' id='delTd'>";
    $res .= 'حذف';
    $res .= "</td>";
   $res .= '</tr>';
   $i++;
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
