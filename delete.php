<?php
include "include/db.php";
$id = $_POST['id'];
$sql = "UPDATE users SET deleted_at = NOW() WHERE id = $id";

if ($db->query($sql) === TRUE) {
    $message =  " با موفقیت حذف شد.";
} else {
    $message = "Error: $sql <br>" . $db->error;
}
