const chatform=document.getElementById("chat-form");
const chatMessages=document.querySelector('.chat-messages')
const roomname=document.getElementById('room-name')
const userList=document.getElementById('users')



// Get user and room text
const { username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix: true
})
//console.log(username,room);
const socket=io();
// join chatroom
socket.emit("joinRoom",{username,room})
//Get room and users 
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
})

// message from server
socket.on("message",message=>{
    console.log(message)
    outputMessage(message)
});

// Message Submit

chatform.addEventListener("submit",(e)=>{
    e.preventDefault();
   // Get message text
    const msg=e.target.elements.msg.value;
  // Emit  message to server
    socket.emit("chatmessage",msg)
})

// output message to DOM
 function outputMessage(message){
  const div=document.createElement("div")
  div.classList.add("message")
  div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector(".chat-messages").appendChild(div)

}
//ADD room name to DOM
function outputRoomName(room){
  roomname.innerText=room;
}
function outputUsers(users){
  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}