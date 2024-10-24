<?php

include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$username = $DATA->username;
$email = $DATA->email;
$password = $DATA->password;

$query = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
$result = $DB->query($query);

if ($result->rowCount() > 0) {
    $row = $result->fetch(PDO::FETCH_ASSOC);
    if ($row['username'] === $username) {
        echo "username_exists";
    } else if ($row['email'] === $email) {
        echo "email_exists";
    }
} else {

require 'PHP_MAILER_MASTER/PHPMailerAutoload.php';
require 'PHP_MAILER_MASTER/EMAIL_PASS.php';

$ml = $_SESSION["MAIL_EMAIL"];
$ps = $_SESSION["PASSWORD_EMAIL"];
// Generate a unique code
$confirmationCode = generateUniqueCode();

// Send the code to the user's email

$bodyContent = "<div style='width: auto;
background: rgba(171,177,186,0.8);
box-shadow: 0px 0px 5px #333333;
border-radius: 5px;
margin-left: 15%;
padding: 2%;
padding-left: 3%;
margin-top: 2%;
text-align: center;'>";


$bodyContent .= "<p> Your confirmation code is: " . $confirmationCode  . "</p>";

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $ml;
        $mail->Password = $ps;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->setFrom('...@gmail.com', 'Hoteru');
        $mail->addReplyTo($email,'');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Confirmation Code';
        $mail->Body = $bodyContent;
        $mailSent =$mail->send();

        if ($mailSent) {
            echo $confirmationCode;
        } else {
            echo "ERROR";
        }
    }

function generateUniqueCode() {
    $code = rand(100000, 999999); // Generate a random 6-digit code
    return $code;
}




?>
