<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$username = $DATA->username;
$email = $DATA->email;
$password = $DATA->password;

$insertQuery = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";
$insertResult = $DB->exec($insertQuery);

if ($insertResult !== false) {
    echo "SUCCESS";
} else {
    echo "ERROR";
}
?>
