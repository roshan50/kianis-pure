<?php
include "include/db.php";

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $len = $_POST['length'];
    $id = $_POST['id'];

    $count = array();
    for($i=0; $i < $len; $i++){
        $search_cluse = "{".$id."-".($i+1)."}";
        $Query = "SELECT * FROM users WHERE referred LIKE '%$search_cluse%'";
        $ExecQuery = MySQLi_query($db, $Query);
        $count[$i] = mysqli_num_rows($ExecQuery);
    }

    echo json_encode($count);
}

?>