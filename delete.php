<?php
include "include/db.php";
$id = $_POST['id'];
$select = "select referred from users WHERE referred LIKE '%$id%'";
$ExecQuery = MySQLi_query($db, $select);
while ($value = MySQLi_fetch_array($ExecQuery)) {
    $ref = $value['referred'];
    remove_ref($ref,$id);
}

$sql = "UPDATE users SET deleted_at = NOW() WHERE id = $id";

if ($db->query($sql) === TRUE) {
    $message =  " با موفقیت حذف شد.".$select;
} else {
    $message = "Error: $sql <br>" . $db->error;
}

function remove_ref($str,$id){
    $array = explode(",", $str);
    for($i=0; $i<count($array); $i++){
        if(strpos($array[$i],$id)!== false){
            unset($array[$i]);
        }
    }

    return implode($array,',');
}
