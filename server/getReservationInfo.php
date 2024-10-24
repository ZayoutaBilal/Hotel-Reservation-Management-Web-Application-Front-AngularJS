<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$id_user = $DATA->id_user;

$today = date("Y-m-d");

$SQL_REQUEST = $DB->query("SELECT id_reservation, fullname, phone, type_chambre, date_debut, date_fin , total FROM reservations 
                                    WHERE id_user = '$id_user' AND date_debut >= '$today'");

$reservations = [];
while ($row = $SQL_REQUEST->fetch(PDO::FETCH_ASSOC)) {
    $reservations[] = $row;
}

echo json_encode($reservations);
?>
