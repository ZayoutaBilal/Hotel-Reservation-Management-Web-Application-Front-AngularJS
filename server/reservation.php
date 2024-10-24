<?php

include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$fullname = $DATA->fullname;
$phone = $DATA->phone;
$type_chambre = $DATA->type_chambre;
$date_debut = $DATA->date_debut;
$date_fin = $DATA->date_fin;
$id_users = $DATA->id_users;

$SQL_REQUEST = $DB->query("SELECT `fullname`, `date_debut`, `date_fin` FROM `reservations` WHERE `fullname` = '$fullname' AND `date_debut` = '$date_debut' AND `date_fin` = '$date_fin'");

    if($SQL_REQUEST->rowCount()) {
        echo "USER_EXIST";
    } else {
        $SQL = $DB->exec("INSERT INTO `tab_reservation`(`fullname`, `phone`, `type_chambre`, `date_debut`, `date_fin`, 'id_uses')
        	 		VALUES ('$fullname', '$phone', '$type_chambre', '$date_debut', '$date_fin', '$id_users')");

        echo "SUCCESS";
    }
?>