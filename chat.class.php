<?php
require_once('error_handler.php');//Include this to handle any error at server
class Chat extends SQLite3
{
      function __construct()
      {
         $this->open('chatting.db');
      }
//Create table in database if not exist	  
public function CreateTable()
  {
    $CT =<<<EOF
      CREATE TABLE IF NOT EXISTS CHAT
      (chat_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      posted_on DATETIME NOT NULL,
      user_name VARCHAR(50) NOT NULL,
      message TEXT NOT NULL);
EOF;
    $this->exec($CT);      
  }	  
//Insert chat in DB
public function postMessage($name, $message)
  {  
    $name = $name;
    $message = $message;
	$query =<<<EOF
      INSERT INTO CHAT(user_name, message, posted_on)
      VALUES ('$name', '$message',DateTime('now'));
EOF;
    $result = $this->exec($query);      
  }
  
//Fetches new messages from server  
public function retrieveNewMessages($id=0) 
  {	  
    $id = $id;
    if($id>0)
    {
$sql =<<<EOF
SELECT chat_id, user_name, message FROM chat WHERE chat_id > '$id' ORDER BY chat_id ASC;
EOF;
   $result = $this->query($sql);
    }
    else
    {
		$sql =<<<EOF
SELECT chat_id, user_name, message FROM (SELECT chat_id, user_name, message FROM CHAT ORDER BY chat_id DESC) AS Last50 ORDER BY chat_id ASC;
EOF;
    } 
    $result = $this->query($sql);
    $response = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    $response .= '<response>';  
    $response .= $this->isDatabaseCleared($id);
    if($result)
    {      
      while ($row = $result->fetchArray(SQLITE3_ASSOC))
      {
        $id = $row['chat_id'];
        $userName =$row['user_name'];  
        $message = $row['message'];
        $response .= '<id>' . $id . '</id>' .  
                     '<name><![CDATA[' . $userName . ']]></name>' .
                     '<message><![CDATA[' . $message . ']]></message>';
      } 	  
    }
    $response = $response . '</response>';
    return $response;    
  }
//fetches the list of users participaed in chat
public function getUsers(){
	$sql =<<<EOF
SELECT DISTINCT user_name FROM CHAT ORDER BY chat_id DESC;
EOF;
    $result = $this->query($sql);
    //$response .= $this->isDatabaseCleared($id);
	$userName = array();
    if($result)
    { 
	$outp = "[";     
      while ($row = $result->fetchArray(SQLITE3_ASSOC))
      {        
          if ($outp != "[") {$outp .= ",";}
    $outp .= '{"Name":"'.$row["user_name"].'"}';
}
$outp .="]";	  
    } 
    return $outp; //Returning output as array   
}
//Check for database is cleared or not	
private function isDatabaseCleared($id)
  {
    if($id>0)
    {   
$check_clear =<<<EOF
SELECT count(*) old FROM chat where chat_id<=' . $id';
EOF;
      $result = $this->query($check_clear);
      $row = $result->fetchArray(SQLITE3_ASSOC);	   
      if($row['old']==0)
       return '<clear>true</clear>';     
	}
    return '<clear>false</clear>'; 
  }
}

?>
