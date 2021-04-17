
var chatURL = "chat.php";
var getUserURL = "getUsers.php";
var xmlHttpGetMessages = createXmlHttpRequestObject();
var updateInterval = 1500; //Retrive data from server after every sec
var debugMode = true;
var lastMessageID = -1; 

//Thifunction successfully return an XMLHttpRequest object used to send and receive data from server
function createXmlHttpRequestObject() 
{
  var xmlHttp;
  try
  {
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
	  //Fol old verdion browser or IE
    var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP");
    for (var i=0; i<XmlHttpVersions.length && !xmlHttp; i++) 
    {
      try 
      { 
        xmlHttp = new ActiveXObject(XmlHttpVersions[i]);
      } 
      catch (e) {}
    }
  }
  if (!xmlHttp)
    alert("Error creating the XMLHttpRequest object.");
  else 
    return xmlHttp;
}

//init() displays the chatbox when page loads and retrives all the messages
function init() 
{
  var oMessageBox = document.getElementById("messageBox");
  oMessageBox.setAttribute("autocomplete", "off");    
  requestNewMessages();

}

//Validates and send message tp server submitted by user
function sendMessage()
{
	 var oUser=document.getElementById("userName");
  if(oUser.value == ""){
    alert("ERROR: Username is mandatory to chat");
	}else
	
  var CurrentMessage = document.getElementById("messageBox");
  var currentUser = document.getElementById("userName").value;
  if (trim(CurrentMessage.value) != "" && trim(currentUser) != "" )
  {
  var json = {		
        message : CurrentMessage.value,
        name : currentUser,
		id : lastMessageID,		
    }
var json_object = "json_sendMessage=" + JSON.stringify(json);
xmlHttpGetMessages.open("POST", chatURL);
xmlHttpGetMessages.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlHttpGetMessages.onreadystatechange = handleReceivingMessages;
xmlHttpGetMessages.send(json_object);
CurrentMessage.value = "";
  }
}

//This function is called after every second using setTimeout function to fetch chat
function requestNewMessages()
{  
  var currentUser = document.getElementById("userName").value;
  if(xmlHttpGetMessages)
  {
    try
    {
      if (xmlHttpGetMessages.readyState == 4 || xmlHttpGetMessages.readyState == 0) 
      {       
           var json = {	        
						id : lastMessageID		
    				}
var json_object = "json_requestNewMessages=" + JSON.stringify(json);
xmlHttpGetMessages.open("POST", chatURL);
xmlHttpGetMessages.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlHttpGetMessages.onreadystatechange = handleReceivingMessages;
xmlHttpGetMessages.send(json_object);
setTimeout("getUser();", updateInterval);
      }
      else
      {
        setTimeout("requestNewMessages();", updateInterval);
      }
    }
    catch(e)
    {
      displayError(e.toString());
    }
  }
}

//Get users list participated in chat
function getUser(){
xmlHttpGetMessages.onreadystatechange = function() {
    if (xmlHttpGetMessages.readyState == 4 && xmlHttpGetMessages.status == 200) {
        var myArr = JSON.parse(xmlHttpGetMessages.responseText);
        displayUser(myArr);//Call displayUser function to print list fo users 
    }
};
xmlHttpGetMessages.open("GET", getUserURL, true);
xmlHttpGetMessages.send();
 // setTimeout("requestNewMessages();", updateInterval);
function displayUser(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += "<li>"+arr[i].Name+"</li>";
    }
    document.getElementById("users").innerHTML = out;
}
	}

	
//Handle response from server
function handleReceivingMessages() 
{
  if (xmlHttpGetMessages.readyState == 4) 
  {
    if (xmlHttpGetMessages.status == 200) 
    {
      try
      {
        readMessages();
      }
      catch(e)
      {
        displayError(e.toString());
      }
    } 
    else
    {
      displayError(xmlHttpGetMessages.statusText);
    }
  }
}

//Manage response from server and put in array
function readMessages()
{  
  var response = xmlHttpGetMessages.responseText;
  if (response.indexOf("ERRNO") >= 0 || response.indexOf("error:") >= 0 || response.length == 0)
    throw(response.length == 0 ? "Void server response." : response);
  response = xmlHttpGetMessages.responseXML.documentElement;
  clearChat = response.getElementsByTagName("clear").item(0).firstChild.data;
  if(clearChat == "true")
  {
    document.getElementById("scroll").innerHTML = "";
    lastMessageID = -1; 
  }
  idArray = response.getElementsByTagName("id");
  nameArray = response.getElementsByTagName("name");
  messageArray = response.getElementsByTagName("message");
  displayMessages(idArray, nameArray, messageArray);
  if(idArray.length>0)
    lastMessageID = idArray.item(idArray.length - 1).firstChild.data;
  setTimeout("requestNewMessages();", updateInterval);
}

//Formatting data to display as individual item
function displayMessages(idArray, nameArray, messageArray)
{
  for(var i=0; i<idArray.length; i++)
  {
    var name = nameArray.item(i).firstChild.data.toString();
    var message = messageArray.item(i).firstChild.data.toString();
    var htmlMessage = "";
    htmlMessage += "<div class=\"item\" >"; 
    htmlMessage += name + ": ";
    htmlMessage += message.toString();
    htmlMessage += "</div><br/>";
    displayMessage (htmlMessage);
  }
}
//Display the final output
function displayMessage(message)
{
  var oScroll = document.getElementById("scroll");
  var scrollDown = (oScroll.scrollHeight - oScroll.scrollTop <= oScroll.offsetHeight );
  oScroll.innerHTML += message;
  oScroll.scrollTop = scrollDown ? oScroll.scrollHeight : oScroll.scrollTop;
}

//This function display any returned from server
function displayError(message)
{
  displayMessage("Error accessing the server! "+(debugMode ? "<br/>" + message : ""));
}

//This function handles the key event when user prsses the ENTER key
function handleKey(e) 
{
  e = (!e) ? window.event : e;      
  code = (e.charCode) ? e.charCode :
         ((e.keyCode) ? e.keyCode :
         ((e.which) ? e.which : 0));     
  if (e.type == "keydown") 
  {
    if(code == 13)//Enter is pressed
    { 
      sendMessage();
    }
  }
}
//Trim function for unwanted spaces
function trim(s)
{
    return s.replace(/(^\s+)|(\s+$)/g, "")
}
