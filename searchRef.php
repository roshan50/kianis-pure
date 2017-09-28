<?php
include "include/db.php";

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $i = $_POST['buy_time'];
    $id = $_POST['id'];

//    $count = array();
    $search_cluse = "{".$id."-".($i)."}";
    $Query = "SELECT * FROM users WHERE referred LIKE '%$search_cluse%'";
    $ExecQuery = MySQLi_query($db, $Query);
    $count = mysqli_num_rows($ExecQuery);

    echo $count;
//    echo json_encode($count);
}

?>