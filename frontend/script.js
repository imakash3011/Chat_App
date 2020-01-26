let socket =io();
socket.on('connected',()=>{
    console.log("Connected " + socket.id)
})

$(function(){
    let msglist=$('#msglist')
    let sendbtn=$('#sendmsg')
    let msgbox=$('#msgbox')
    let loginbox =$('#loginbox')
    let loginbtn =$('#loginbtn')
    let loginDiv =$('#login-div')
    let chatDiv =$('#chat-div')


    let user=''

    sendbtn.click(function(){
        // let msg=msgbox.val()
        //event (data) is being send here in the form of the json object
        //which have the key and the value pair in it 
        socket.emit('send_msg',{
            //we will send the user (msg-sender name) and the message
            //here we are sending msg in the form of JSON object
            //key-value pair is begin formed here 
            user:user,
            message:msgbox.val()})
    })

    //to hide the login page after user is login into the page
    loginbtn.click(function(){
        user=loginbox.val()
        chatDiv.show()
        loginDiv.hide()
        socket.emit('login',{
            user:user
        })
    })

    //appending all the send and reveived data in client side  
    socket.on('recv_msg',function(data){
        msglist.append($('<li>' + data.user + ': ' + data.message + '</li>'))
    })

})