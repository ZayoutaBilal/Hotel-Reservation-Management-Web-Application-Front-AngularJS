<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));

$id_reservation = $DATA->id_reservation;
$fullname = $DATA->fullname;
$phone = $DATA->phone;
$type_chambre = $DATA->type_chambre;
$date_debut = $DATA->date_debut;
$date_fin = $DATA->date_fin;

// Check if there is an available chambre of the same type in the chambres table
$SQL_AVAILABLE = $DB->query("SELECT id_chambre, prix FROM chambres
                            WHERE type_chambre = '$type_chambre'
                            AND id_chambre NOT IN (
                                SELECT id_chambre FROM reservations
                                WHERE id_reservation != '$id_reservation'
                                    AND (
                                        (date_debut BETWEEN '$date_debut' AND '$date_fin')
                                        OR (date_fin BETWEEN '$date_debut' AND '$date_fin')
                                        OR ('$date_debut' BETWEEN date_debut AND date_fin)
                                        OR ('$date_fin' BETWEEN date_debut AND date_fin)
                                    )
                            )
                            LIMIT 1");

if ($SQL_AVAILABLE->rowCount()) {
    // Get the available chambre id and price
    $chambre = $SQL_AVAILABLE->fetch(PDO::FETCH_ASSOC);
    $id_chambre = $chambre['id_chambre'];
    $prix_chambre = $chambre['prix'];

    // Calculate the number of nights
    $date_debut_obj = new DateTime($date_debut);
    $date_fin_obj = new DateTime($date_fin);
    $interval = $date_debut_obj->diff($date_fin_obj);
    $nbr_nights = $interval->format('%a');

    // Calculate the total value
    $total = $nbr_nights * $prix_chambre;

    // Update the reservation with the available chambre id and total value
    $SQL_REQUEST = $DB->query("UPDATE reservations SET fullname = '$fullname', phone = '$phone', type_chambre = '$type_chambre', date_debut = '$date_debut', date_fin = '$date_fin', id_chambre = '$id_chambre', total = '$total' WHERE id_reservation = '$id_reservation'");

    if ($SQL_REQUEST->rowCount()) {
        
        require 'PHP_MAILER_MASTER/PHPMailerAutoload.php';
        require 'PHP_MAILER_MASTER/EMAIL_PASS.php';

        
        $SQL_EMAIL = $DB->query("SELECT email FROM users WHERE id_user = (SELECT id_user FROM reservations WHERE id_reservation = '$id_reservation')");
        $user = $SQL_EMAIL->fetch(PDO::FETCH_ASSOC);
        $email = $user['email'];

        // $email = "douaaelkorti@gmail.com";
        //Getting email and password for php_mailer configuration !
        $ml = $_SESSION["MAIL_EMAIL"];
        $ps = $_SESSION["PASSWORD_EMAIL"];
        $email = $user['email'];
        // $email = "douaaelkorti@gmail.com";
        //Creating msg body which gonna be sent to u+the user email !
        $SQL_RESERVATION = $DB->query("SELECT * FROM reservations WHERE id_reservation = '$id_reservation'");
        $reservation = $SQL_RESERVATION->fetch(PDO::FETCH_ASSOC);

        // Create the reservation form in the email body
        $bodyContent = "<div style='width: auto;
                                background: rgba(171,177,186,0.8);
                                box-shadow: 0px 0px 5px #333333;
                                border-radius: 5px;
                                margin-left: 15%;
                                padding: 2%;
                                padding-left: 3%;
                                margin-top: 2%;
                                text-align: center;'>";

        $bodyContent  .= "<h1>Your Updated Reservation Details</h1>";
        $bodyContent .= "<p><strong>Full Name:</strong> " . $reservation['fullname'] . "</p>";
        $bodyContent .= "<p><strong>Phone:</strong> " . $reservation['phone'] . "</p>";
        $bodyContent .= "<p><strong>Chambre Type:</strong> " . $reservation['type_chambre'] . "</p>";
        $bodyContent .= "<p><strong>Start Date:</strong> " . $reservation['date_debut'] . "</p>";
        $bodyContent .= "<p><strong>End Date:</strong> " . $reservation['date_fin'] . "</p>";
        $bodyContent .= "<p><strong>Chambre ID:</strong> " . $reservation['id_chambre'] . "</p>";
        $bodyContent .= "<p><strong>Total:</strong> " . $reservation['total'] . "</p>";
        $bodyContent .= "</div>";
        //PHP_Mailer configuration ! 

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $ml;
        $mail->Password = $ps;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->setFrom('douaaelkorti@gmail.com', 'Hoteru');
        $mail->addReplyTo($email,'');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Form of your reservation after the update';
        $mail->Body = $bodyContent;
        $mail->send();
        $response = array("message" => "SUCCESS", "total" => $total, "id_chambre" => $id_chambre);
        echo json_encode($response);
        
        } else {
            $response = array("message" => "ERROR");
            echo json_encode($response);
        }
    }
    else {
        $response = array("message" => "No available");
        echo json_encode($response);
    }




// require 'vendor/autoload.php'; // Include the PHPMailer library

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// include 'connexion.php';

// $DATA = json_decode(file_get_contents("php://input"));

// $id_reservation = $DATA->id_reservation;
// $fullname = $DATA->fullname;
// $phone = $DATA->phone;
// $type_chambre = $DATA->type_chambre;
// $date_debut = $DATA->date_debut;
// $date_fin = $DATA->date_fin;

// // Check if there is an available chambre of the same type in the chambres table
// $SQL_AVAILABLE = $DB->query("SELECT id_chambre FROM chambres
//                             WHERE type_chambre = '$type_chambre'
//                             AND id_chambre NOT IN (
//                                 SELECT id_chambre FROM reservations
//                                 WHERE id_reservation != '$id_reservation'
//                                     AND (
//                                         (date_debut BETWEEN '$date_debut' AND '$date_fin')
//                                         OR (date_fin BETWEEN '$date_debut' AND '$date_fin')
//                                         OR ('$date_debut' BETWEEN date_debut AND date_fin)
//                                         OR ('$date_fin' BETWEEN date_debut AND date_fin)
//                                     )
//                             )
//                             LIMIT 1");

// if ($SQL_AVAILABLE->rowCount()) {
//     // Get the available chambre id
//     $chambre = $SQL_AVAILABLE->fetch(PDO::FETCH_ASSOC);
//     $id_chambre = $chambre['id_chambre'];

//     // Update the reservation with the available chambre id
//     $SQL_REQUEST = $DB->query("UPDATE reservations SET fullname = '$fullname', phone = '$phone', type_chambre = '$type_chambre', date_debut = '$date_debut', date_fin = '$date_fin', id_chambre = '$id_chambre' WHERE id_reservation = '$id_reservation'");

//     if ($SQL_REQUEST->rowCount()) {
//         // Retrieve the user's email from the database
//         $SQL_USER = $DB->query("SELECT email FROM reservations WHERE id_reservation = '$id_reservation'");
//         $user = $SQL_USER->fetch(PDO::FETCH_ASSOC);
//         $email = $user['email'];

//         // Send reservation details to the user's email using PHPMailer
//         $mail = new PHPMailer(true);

//         try {
//             // SMTP configuration
//             $mail->isSMTP();
//             $mail->Host = 'smtp.gmail.com';
//             $mail->SMTPAuth = true;
//             $mail->Username = 'bilal.zay02@gmail.com';
//             $mail->Password = 'pijdrdqkggqrnfvo';
//             $mail->SMTPSecure = 'tls';
//             $mail->Port = 587;

//             // Sender and recipient
//             $mail->setFrom('bilal.zay02@gmail.com', 'Douaa');
//             $mail->addAddress($email, $fullname);

//             // Email content
//             $mail->isHTML(true);
//             $mail->Subject = "Reservation Confirmation";
//             $mail->Body = "Dear $fullname,<br><br>Your reservation has been successfully updated. Here are the details:<br><br>Full Name: $fullname<br>Phone: $phone<br>Type of Room: $type_chambre<br>Start Date: $date_debut<br>End Date: $date_fin<br><br>Thank you for choosing our service.";

//             $mail->send();

//             $response = array("message" => "SUCCESS");
//             echo json_encode($response);
//         } catch (Exception $e) {
//             $response = array("message" => "ERROR", "error" => $mail->ErrorInfo);
//             echo json_encode($response);
//         }
//     } else {
//         $response = array("message" => "ERROR", "error" => "Failed to update the reservation");
//         echo json_encode($response);
//     }
// } else {
//     $response = array("message" => "No available");
//     echo json_encode($response);
// }




// include 'connexion.php';

// $DATA = json_decode(file_get_contents("php://input"));

// $id_reservation = $DATA->id_reservation;
// $fullname = $DATA->fullname;
// $phone = $DATA->phone;
// $type_chambre = $DATA->type_chambre;
// $date_debut = $DATA->date_debut;
// $date_fin = $DATA->date_fin;

// // Check if there is an available chambre of the same type in the chambres table
// $SQL_AVAILABLE = $DB->query("SELECT id_chambre FROM chambres
//                             WHERE type_chambre = '$type_chambre'
//                             AND id_chambre NOT IN (
//                                 SELECT id_chambre FROM reservations
//                                 WHERE id_reservation != '$id_reservation'
//                                     AND (
//                                         (date_debut BETWEEN '$date_debut' AND '$date_fin')
//                                         OR (date_fin BETWEEN '$date_debut' AND '$date_fin')
//                                         OR ('$date_debut' BETWEEN date_debut AND date_fin)
//                                         OR ('$date_fin' BETWEEN date_debut AND date_fin)
//                                     )
//                             )
//                             LIMIT 1");

// if ($SQL_AVAILABLE->rowCount()) {
//     // Get the available chambre id
//     $chambre = $SQL_AVAILABLE->fetch(PDO::FETCH_ASSOC);
//     $id_chambre = $chambre['id_chambre'];

//     // Update the reservation with the available chambre id
//     $SQL_REQUEST = $DB->query("UPDATE reservations SET fullname = '$fullname', phone = '$phone', type_chambre = '$type_chambre', date_debut = '$date_debut', date_fin = '$date_fin', id_chambre = '$id_chambre' WHERE id_reservation = '$id_reservation'");

//     if ($SQL_REQUEST->rowCount()) {
//         // Send reservation details to the user's email
//         $to = $email; // Replace with the user's email retrieved from the database
//         $subject = "Reservation Confirmation";
//         $message = "Dear $fullname,\n\nYour reservation has been successfully updated. Here are the details:\n\nFull Name: $fullname\nPhone: $phone\nType of Room: $type_chambre\nStart Date: $date_debut\nEnd Date: $date_fin\n\nThank you for choosing our service.";
//         $headers = "From: douaaelkorti@gmailcom"; // Replace with your email address
//         mail($to, $subject, $message, $headers);

//         $response = array("message" => "SUCCESS");
//         echo json_encode($response);
//     } else {
//         $response = array("message" => "ERROR");
//         echo json_encode($response);
//     }
// } else {
//     $response = array("message" => "No available");
//     echo json_encode($response);
// }

// include 'connexion.php';

// $DATA = json_decode(file_get_contents("php://input"));

// $id_reservation = $DATA->id_reservation;
// $fullname = $DATA->fullname;
// $phone = $DATA->phone;
// $type_chambre = $DATA->type_chambre;
// $date_debut = $DATA->date_debut;
// $date_fin = $DATA->date_fin;

// // Check if there is an available chambre of the same type in the chambres table
// $SQL_AVAILABLE = $DB->query("SELECT id_chambre, prix FROM chambres
//                             WHERE type_chambre = '$type_chambre'
//                             AND id_chambre NOT IN (
//                                 SELECT id_chambre FROM reservations
//                                 WHERE id_reservation != '$id_reservation'
//                                     AND (
//                                         (date_debut BETWEEN '$date_debut' AND '$date_fin')
//                                         OR (date_fin BETWEEN '$date_debut' AND '$date_fin')
//                                         OR ('$date_debut' BETWEEN date_debut AND date_fin)
//                                         OR ('$date_fin' BETWEEN date_debut AND date_fin)
//                                     )
//                             )
//                             LIMIT 1");

//     if ($SQL_AVAILABLE->rowCount()) {
//         // Get the available chambre id and price
//         $chambre = $SQL_AVAILABLE->fetch(PDO::FETCH_ASSOC);
//         $id_chambre = $chambre['id_chambre'];
//         $prix_chambre = $chambre['prix'];

//         // Calculate the number of nights
//         $date_debut_obj = new DateTime($date_debut);
//         $date_fin_obj = new DateTime($date_fin);
//         $interval = $date_debut_obj->diff($date_fin_obj);
//         $nbr_nights = $interval->format('%a');

//         // Calculate the total value
//         $total = $nbr_nights * $prix_chambre;

//         // Update the reservation with the available chambre id and total value
//         $SQL_REQUEST = $DB->query("UPDATE reservations SET fullname = '$fullname', phone = '$phone', type_chambre = '$type_chambre', date_debut = '$date_debut', date_fin = '$date_fin', id_chambre = '$id_chambre', total = '$total' WHERE id_reservation = '$id_reservation'");

//         if ($SQL_REQUEST->rowCount()) {
//             $response = array("message" => "SUCCESS", "total" => $total ,"id_chambre" => $id_chambre );
//             echo json_encode($response);
//         } else {
//             $response = array("message" => "ERROR");
//             echo json_encode($response);
//         }
//     } else {
//         $response = array("message" => "No available");
//         echo json_encode($response);
//     }
?>
