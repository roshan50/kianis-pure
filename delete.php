<?php
include "include/db.php";
$id = $_POST['id'];
$Query = "DELETE FROM users WHERE id = $id";
//$ExecQuery = MySQLi_query($db, $Query);

if ($db->query($sql) === TRUE) {
    $message =  " با موفقیت حذف شد.";
} else {
    $message = "Error: $Query <br>" . $db->error;
}