    const path=require("path"); 
    const http=require("http");
    const express=require("express")
    const socketio=require("socket.io")
    const formatmessage=require("./utils/messages.js")
    const {userJoin,getCurrentUser,userleave,getRoomUsers}=require("./utils/users.js")



    
    const app=express();
    const server=http.createServer(app);
    const io=socketio(server)
    // Set static Folder
    app.use(express.static(path.join(__dirname,"public")));
    const bot="ChatCord"
    //Set static folder
    io.on("connection",socket=>{
        //console.log("new connection..")
        socket.on("joinRoom",({username,room})=>{
        const user=userJoin(socket.id,username,room)

            socket.join(user.room)
            
        //this will emit message only to the user
        socket.emit("message",formatmessage(bot,"Welcome to chatcord"))

        // this will emit message all the other user
        socket.broadcast.to(user.room).emit("message",formatmessage(bot,`${user.username} has joined the chat`))

        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
        });

        // Listen for chatmessage
        socket.on("chatmessage",msg=>{
            const user=getCurrentUser(socket.id);
            io.to(user.room).emit("message",formatmessage(user.username,msg))
        })
        // when a user disconnects
        socket.on("disconnect",()=>{
            const user=userleave(socket.id)
            if(user){
                io.to(user.room).emit("message",formatmessage(bot,`${user.username} has left the chat` ))
            //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
            }
            
            //console.log("hii")
        });
    })



    const port=9000||process.env.port;


    server.listen(port,()=>console.log(`server connected to port ${port}`))