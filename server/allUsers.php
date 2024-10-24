<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));


$SQL_REQUEST = $DB->query("SELECT * FROM users 
                                    WHERE typeofuser <> 'Admin'
                                    ORDER BY id_user DESC ");

$users = [];
while ($row = $SQL_REQUEST->fetch(PDO::FETCH_ASSOC)) {
    $users[] = $row;
}

echo json_encode($users);
?>
