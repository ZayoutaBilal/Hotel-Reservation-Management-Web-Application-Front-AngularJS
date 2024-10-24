<?php

try
{
    //Database name
    $DB_NAME  = "pfe";
    $DB = new PDO( 'mysql:host=localhost;dbname='.$DB_NAME, 'root', '');
}
catch (Exception $e)
{
    die('There is no database with the name "'.$DB_NAME.'" ');
}

?>