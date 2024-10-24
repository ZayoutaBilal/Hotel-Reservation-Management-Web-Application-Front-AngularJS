<?php

include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$name = $DATA->name;
$email = $DATA->email;
$subject = $DATA->subject;
$message = $DATA->message;

$SQL_REQUEST = $DB->query("SELECT `subject`, `message` FROM `messages` WHERE `name` = '$name' AND `email` = '$email' AND `subject` = '$subject' AND `message` = '$message'");

    if($SQL_REQUEST->rowCount()) {
        echo "USER_EXIST";
    } else {
        $SQL = $DB->exec("INSERT INTO `tab_contact`(`name`, `email`, `subject`,`message`)
        	 		VALUES ('$name', '$email', '$subject','$message')");

        echo "SUCCESS";
    }
?>