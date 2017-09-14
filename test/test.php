<head>
    <link rel="stylesheet" href="style.css">
</head>
<form method="post">
    <input type="checkbox" id="passed" name="2month_passed"/><label for="passed" id="passed_label">Toggle</label>
    <button type = "submit" name = "save">ثبت</button>
</form>

<?php
/**
 * Created by PhpStorm.
 * User: Lemon-PC
 * Date: 9/7/2017
 * Time: 3:39 PM
 */
//echo $_POST['2month_passed'];
$str = 'one,two,three,four';
$s2 = explode(",", $str);
echo $s2[0];
foreach ($s2 as $s3) {
    echo $s3;
}