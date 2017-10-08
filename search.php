<?php
include "include/db.php";
include ("include/lib.php");
include ("include/const.php");


$row_per_page = ROW_PER_PAGE;

function search_where($last_name_search,$name_search,$phone_search){
    $where = '';

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
         case '100' : $where= $buy_where;break;
         case '001' : $where= $buyRef_where;break;
         case '010' : $where= $ref_where;break;
     }

    if($where) $where=' AND '.$where;
    return $where;
}


if($_POST['page'] != ''){
    $page = $_POST['page'];
    $offset = ($page-1) * $row_per_page;
}else{
    $offset = 0;
    $page = 1;
}

if($_POST['sort_col'] != ''){
    $sort_col = $_POST['sort_col'];
}else{
    $sort_col = 'created_at DESC';
}

$where = search_where($_POST['last_name_search'],$_POST['name_search'],$_POST['phone_search']);
$filter_where = filter_where($_POST['filter']);

$Query = "SELECT * FROM users WHERE deleted_at IS NULL $where $filter_where ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset";
$ExecQuery = MySQLi_query($db, $Query);
$res = get_users_list($ExecQuery,$row_per_page,$_POST['selectedId'],$page);

// Pagination system
$sql = "SELECT id FROM users WHERE deleted_at IS NULL $where $filter_where";
$result = mysqli_query($db,$sql);
$count = mysqli_num_rows($result);

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
