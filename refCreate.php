<?php
include("include/db.php");

function check_duplicate($db, $column_name, $column_value)
{
    $return = false;
    $sql = "SELECT id FROM users WHERE $column_name = '$column_value' AND deleted_at IS NULL";
    $result = mysqli_query($db, $sql);
    $count = mysqli_num_rows($result);

    if ($count > 0)
        $return = true;
    return $return;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $status = 500;
    $id = 0;
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    if (check_duplicate($db, 'phone', $phone)) {
        $message = "شماره تلفن تکراریست";
        return;
    }
    if (strlen($phone) != 11) {
        $message = "شماره تلفن نامعتبر است!";
        return;
    }

    $sql = "INSERT INTO users (`name`, `last_name`, `password`, `phone`, `created_at`)
            VALUES ('$name','$last_name','$password', '$phone', NOW())";

    if ($db->query($sql) === TRUE) {
        $message = $last_name . " با موفقیت اضافه شد.";
        $status = 200;
        $id = mysqli_insert_id($db);
    } else {
        $message = "Error: " . $sql . "<br>" . $db->error;
    }

    $res = array(
        "message" => $message,
        "status" => $status,
        "id" => $id,
        "count" => $sql
    );

    print json_encode($res);
}
?>