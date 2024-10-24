<?php
include 'connexion.php';

$today = date("Y-m-d");

// Query to retrieve the available rooms
$SQL_REQUEST = $DB->query("SELECT id_chambre, type_chambre FROM chambres 
                          WHERE id_chambre NOT IN 
                          (SELECT id_chambre FROM reservations WHERE date_debut <= '$today' AND date_fin >= '$today')");

$availableRooms = [];
while ($row = $SQL_REQUEST->fetch(PDO::FETCH_ASSOC)) {
    $availableRooms[] = $row;
}

echo json_encode($availableRooms);
?>
