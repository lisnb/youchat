/*
* @Author: lisnb.pc
* @Date:   2016-03-25 20:23:24
* @Last Modified by:   lisnb.pc
* @Last Modified time: 2016-03-25 22:53:33
*/



var msgidcache = {
}

function generate_msgid(){
    return Math.random().toString(36);
}

function refresh(){
    var contents_div = $("div[class='content']");
    var msgs = [];
    if(!contents_div)
        return msgs;
    console.log("length: "+contents_div.length.toString())
    for(var i = contents_div.length-1; i>=0; i--){
        console.log(i);
        var msg = {
        };
        var user_h4 = $(contents_div[i]).find("h4");
        if(user_h4){
            msg.user = $(user_h4).text() || "本人";
        }
        msg.id = generate_msgid()
        var message_div = $(contents_div[i]).find("div");
        if(message_div){
            // console.log('message_div')
            var cm = $(message_div).data("cm");
            if(cm){
                msg.id = cm.msgId || generate_msgid();
                if(msg.id in msgidcache)
                    break;
                if(cm.msgType){
                    if(cm.msgType==="1"){
                        var body_pre = $(contents_div[i]).find("pre");
                        if(body_pre)
                            msg.body = $(body_pre).text();
                        msg.type = "文字"
                    }else if(cm.msgType==="47"){
                        //emotion
                        msg.type = "表情";
                    }else if(cm.msgType==="3"){
                        msg.type= "图片";
                    }
                }
            }
        }
        // console.log(msg);
        msgidcache[msg.id]=undefined;
        msgs.push(msg);
    }
    console.log(msgs);
    return msgs;
}

// refresh()
var refresh_interval = setInterval(refresh,5000);