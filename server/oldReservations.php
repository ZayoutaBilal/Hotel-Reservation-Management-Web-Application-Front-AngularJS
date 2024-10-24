<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));

$today = date("Y-m-d");

$SQL_REQUEST = $DB->query("SELECT * FROM reservations 
                                    WHERE date_fin < '$today'");

$reservations = [];
while ($row = $SQL_REQUEST->fetch(PDO::FETCH_ASSOC)) {
    $reservations[] = $row;
}

echo json_encode($reservations);
?>