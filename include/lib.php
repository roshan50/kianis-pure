<?php
function create_ref_table_rows($obj){
    $res = '';
    $i = 1;
    while ($value = $obj) {
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
        $res .= "<td scope='row' id='selectTd' >";
        $j = $i - 1;
//        $res .= "<div id='buyselectionTd'>
//                      <select id='buyTimeTd'>";
//        $res .="<option>$buy_times[$j]</option>";
//        $res .="</select></div>";
        $res .= "</td>";
        $res .= "<td scope='row' id='buy_cash_td'>";
        $cash = explode(',',$value['buy_cash']);
//        $res .= $cash[$buy_times[$j]-1];
        $res .= "</td>";
        $month = explode(',',$value['buy_2month']);
        $res .= "<td scope='row' id='buy_2month_td'>";
//        $res .= $month[$buy_times[$j]-1];
        $res .= "</td>";
        $month_passed = explode(',',$value['2month_passed']);
//        $month_passed = ($month_passed[$buy_times[$j]-1] == 'f') ? 'نشده' : 'شده';
        $res .= "<td scope='row' id='month_passed_td'>";
        $res .= $month_passed;
        $res .= "</td>";
        $cheque = explode(',',$value['buy_cheque']);
        $res .= "<td scope='row' id='buy_cheque_td'>";
//        $res .= $cheque[$buy_times[$j]-1];
        $res .= "</td>";
        $cheque_passed = explode(',',$value['cheque_passed']);
//        $cheque_passed = ($cheque_passed[$buy_times[$j]-1] == 'f') ? 'نشده' : 'شده';
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
}
?>