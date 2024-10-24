<?php 
    include 'connexion.php';

    $DATA = json_decode(file_get_contents("php://input"));
    $username = $DATA->username;
    $password = $DATA->password;
  
    $SQL_REQUEST = $DB->query("SELECT * FROM `users` WHERE `username` = '$username' AND `password` = '$password'");
  
    if($SQL_REQUEST->rowCount()) {
        $results = $SQL_REQUEST->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } else {
        echo "LOGIN_INCORRECT";
    }
?>
