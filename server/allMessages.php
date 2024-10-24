<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));


$SQL_REQUEST = $DB->query("SELECT * FROM messages ORDER BY id_message DESC ");

$messages = [];
while ($row = $SQL_REQUEST->fetch(PDO::FETCH_ASSOC)) {
    $messages[] = $row;
}

echo json_encode($messages);
?>
