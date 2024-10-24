<?php/*
session_start();
if(isset($_POST['email'])){
	$email = $_POST['email'];
	$confirmationCode = rand(100000, 999999);
	// Enregistrer le code de confirmation dans la base de données pour l'email
	// Envoyer l'e-mail de confirmation contenant le code
	$_SESSION['email'] = $email;
	$_SESSION['confirmationCode'] = $confirmationCode;
	header("Location: confirmationCode.php");
	exit();
}
if(isset($_SESSION['email']) && isset($_GET['confirmationCode'])){
	if($_SESSION['confirmationCode'] == $_GET['confirmationCode']){
		// Marquer l'e-mail comme confirmé dans la base de données
		// Si la confirmation est réussie, redirigez l'utilisateur vers la page de confirmation réussie
		$_SESSION['confirmationComplete'] = true;
        echo "SUCCESS";
		header("Location: confirmation-success.php");
		exit();
	} else {
		// Afficher un message d'erreur si le code de confirmation est incorrect
		$error = "Le code de confirmation est incorrect. Veuillez réessayer.";
		}
}*/
?>