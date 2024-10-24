<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));

    $id_user = $DATA->id_user;
    $fullname = $DATA->fullname;
    $phone = $DATA->phone;
    $type_chambre = $DATA->type_chambre;
    $date_debut = $DATA->date_debut;
    $date_fin = $DATA->date_fin;

  // Check if a room of the given type and status=1 is available
  $sql = "SELECT * FROM chambres WHERE type_chambre = '$type_chambre' AND statut = 1";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    // Room available, proceed with reservation
    // ... Your reservation logic here ...

    // Return success message to AngularJS
    echo 'SUCCESS_MSG';
  } else {
    // No room available
    echo 'NO_ROOM_AVAILABLE';
  }


$conn->close();
?>
