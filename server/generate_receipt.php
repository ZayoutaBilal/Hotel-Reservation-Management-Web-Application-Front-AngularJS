<?php
include 'connexion.php';

$DATA = json_decode(file_get_contents("php://input"));
$reservationId = $DATA->reservationId;

// Generate the receipt PDF file and save it to a desired location
// Replace this code with your actual implementation to generate the receipt

// Assuming the receipt file is saved as "reservation_receipt.pdf"
$receiptFile = 'reservation_receipt.pdf';

// Define the file URL
$fileUrl = 'http://example.com/path/to/receipts/' . $receiptFile;

$response = array("fileUrl" => $fileUrl);
echo json_encode($response);
?>
