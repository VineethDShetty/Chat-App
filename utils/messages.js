const moment=require("moment");


function formatmessage(username,text){
    return {
        username,
        text,
        time: moment().format("hh:mm a")
    }

}
module.exports=formatmessage;