<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$id_reservation = $DATA->id_reservation;

$SQL = $DB->exec("DELETE FROM reservations WHERE id_reservation = '$id_reservation'");

if ($SQL) {
  echo "SUCCESS";
} else {
  echo "ERROR";
}

?>
