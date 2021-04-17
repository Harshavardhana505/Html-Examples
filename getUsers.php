<?php
require_once("chat.class.php");
$chat = new Chat();

if(isset($_POST['json_requestUser']))
{
	$chat->CreateTable();	
 	//$json_decode = json_decode($_POST['json_requestNewMessages']);
	//$id = $json_decode->id;  
}
if(ob_get_length())
ob_clean();
header('Cache-Control: no-cache, must-revalidate'); 
header('Pragma: no-cache');
header('Content-Type: text/xml');
echo $chat->getUsers();

?>
