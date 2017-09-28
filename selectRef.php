<?php
include "include/db.php";
function search_where($last_name_search,$name_search,$phone_search){
    $where = '';
    if($last_name_search) { if($where) $and = "AND"; else $and = ""; $where.=" $and last_name LIKE '$last_name_search%'";}
    if($name_search){ if($where) $and = "AND"; else $and = ""; $where.=" $and name LIKE '$name_search%'";}
    if($phone_search){ if($where) $and = "AND";else $and = ""; $where.=" $and phone LIKE '$phone_search%'";}
//    if($where) $where = "WHERE $where";
    return $where;
}


if($_SERVER["REQUEST_METHOD"] == "POST") {
    $ids = $_POST['ids'];
    if(count($ids) > 0) {
        $row_per_page = 5;
        $page = $_POST['page'];
        $offset = ($page-1) * $row_per_page;

        $where = search_where($_POST['last_name_search'],$_POST['name_search'],$_POST['phone_search']);

        if(isset($_POST['sort_col'])){
            $sort_col = $_POST['sort_col'];
        }else{
            $sort_col = 'created_at DESC';
        }
        $sort_col = 'created_at DESC';
        //..................................................................................................
        $buy_times = $_POST['buy_times'];
        $Query = '';
        for ($i = 0; $i < count($ids); $i++) {
            $sql = "SELECT * FROM users WHERE id = $ids[$i] $where";
            $Query .= $Query ? ' UNION ALL ' . $sql : $sql;
        }

        $ExecQuery = MySQLi_query($db, $Query." ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset");

        $i = 1;
        $res = '';
        while ($value = MySQLi_fetch_array($ExecQuery)) {
            $id = $value['id'];
            $res .= "<tr data-id='$id'>";
            $res .= "<td scope='row' id='deleteTd' class='deleteTd' onclick='delete_record(this)'>حذف";
            $res .= "</td>";
            $res .= "<td scope='row' id='numTd'>";
            $res .= $i;
            $res .= "</td>";
            $res .= "<td scope='row' id='nameTd'>";
            $res .= $value['name'];
            $res .= "</td>";
            $res .= "<td scope='row' id='lastNameTd'>";
            $res .= $value['last_name'];
            $res .= "</td>";
            $res .= "<td scope='row' id='phoneTd'>";
            $res .= $value['phone'];
            $res .= "</td>";
            $gender = ($value['gender'] == 0) ? 'مرد' : 'زن';
            $res .= "<td scope='row' id='genderTd'>";
            $res .= $gender;
            $res .= "</td>";
            $res .= "<td scope='row' id='birthTd'>";
            $res .= $value['birth_date'];
            $res .= "</td>";
            $res .= "<td scope='row' id='buyTimeTd' >";
            $j = $i - 1;
            $res .= "<div>";
            $res .="$buy_times[$j]";
            $res .="</div>";
            $res .= "</td>";
            $res .= "<td scope='row' id='buy_cash_td'>";
            $cash = explode(',',$value['buy_cash']);
            $res .= $cash[$buy_times[$j]-1];
            $res .= "</td>";
            $month = explode(',',$value['buy_2month']);
            $res .= "<td scope='row' id='buy_2month_td'>";
            $res .= $month[$buy_times[$j]-1];
            $res .= "</td>";
            $month_passed = explode(',',$value['2month_passed']);
            $month_passed = ($month_passed[$buy_times[$j]-1] == 'f') ? 'نشده' : 'شده';
            $res .= "<td scope='row' id='month_passed_td'>";
            $res .= $month_passed;
            $res .= "</td>";
            $cheque = explode(',',$value['buy_cheque']);
            $res .= "<td scope='row' id='buy_cheque_td'>";
            $res .= $cheque[$buy_times[$j]-1];
            $res .= "</td>";
            $cheque_passed = explode(',',$value['cheque_passed']);
            $cheque_passed = ($cheque_passed[$buy_times[$j]-1] == 'f') ? 'نشده' : 'شده';
            $res .= "<td scope='row' id='cheque_passed_td'>";
            $res .= $cheque_passed;
            $res .= "</td>";
            $res .= "<td scope='row' id='referredTd'>";
            $res .= $value['referred'];
            $res .= "</td>";
            $res .= "<td scope='row' id='scoreTd'>";
            $res .= $value['score'];
            $res .= "</td>";
            $res .= '</tr>';
            $i++;
        }
        $len = $row_per_page - $i;
        for($i=0; $i<=$len; $i++){
            $res .= '<tr class="empty-row">
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



        $result2 = mysqli_query($db,$Query);
        $count = mysqli_num_rows($result2);
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


//echo $pagination;
        $list = array(
//            "obj" => $obj,
            "table" => $res,
            "pagination" => $pagination,
            "count" => $Query." ORDER BY $sort_col  LIMIT $row_per_page OFFSET $offset"
        );

        print json_encode($list);

    }

}

?>