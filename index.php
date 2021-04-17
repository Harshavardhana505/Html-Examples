<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Chatting app	</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type="text/javascript" src="chat.js" ></script>
<style type="text/css">
body {
	font-family: cantarell light;
	margin: 5px;
	font-size: 15px;
}
#scroll {
	position: relative;
	width: 375px;
	height: 270px;
	overflow: auto;	
	border-right:1px solid #000;
}
input[type=text]{
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=button]{
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

#content{
	border:5px solid #000;
	}	
	html{
	background-color:green;	
	}
</style>
</head>
<body>
<div id="chatBox">
<table id="content">
  <tr>
    <td><div id="scroll"></div></td>
  <td>
  <div id="scroll">
  <h4>List of Users participated in chat</h4>
  <ul id="users" style="list-style:circle">
  </ul>
  </div>
  </td>
  </tr>
</table>
<div>
  <input type="text" id="userName"  placeholder="Enter Username" required/>
  <input type="text" id="messageBox" onkeydown="handleKey(event)"/>
  <input type="button" value="Send" onclick="sendMessage();" />
</div>
</div>
<script type="text/javascript">
window.onload = function()
      {
          init();//This function executed when page loads
      };
</script>
</body>
</html>
