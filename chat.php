<?php
require_once("chat.class.php"); //Include chat class
$chat = new Chat();//Create object of class chat
$id = 0;//Default value of id

//If request is to send message
if(isset($_POST['json_sendMessage']))
{
  	$json_decode = json_decode($_POST['json_sendMessage']);
	$name = $json_decode->name;
	$message = $json_decode->message;
	$id = $json_decode->id;
  
  if ($name != '' && $message != '') 
  {  
    $chat->postMessage($name, $message); //Call post message function
  }
}
//If request is to retrive message
else if(isset($_POST['json_requestNewMessages']))
{
	$chat->CreateTable(); //Create table if not exist	
 	$json_decode = json_decode($_POST['json_requestNewMessages']);
	$id = $json_decode->id;  
}
if(ob_get_length())
ob_clean();//Clear buffer for previous content
header('Cache-Control: no-cache, must-revalidate'); 
header('Pragma: no-cache');
header('Content-Type: text/xml');
echo $chat->retrieveNewMessages($id); //Call retrive message function which prints output

?>
