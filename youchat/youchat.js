/*
* @Author: lisnb.pc
* @Date:   2016-03-25 20:23:24
* @Last Modified by:   lisnb.pc
* @Last Modified time: 2016-03-28 11:22:46
*/



var YouChat = {
    msgidcache: {},
    generate_msgid: function(){
        return Math.random().toString(36);
    },
    msgidcachelimit: 10000,
    clearcache:function(){
        if(YouChat.msgidcache.length >= YouChat.msgidcachelimit){
            YouChat.msgidcache = {};
        }
    },
    getmsgs: function(){
        var contents_div = $("div[class='content']");
        var msgs = [];
        if(contents_div.length === 0)
            return msgs;
        console.log("length: "+contents_div.length.toString())
        for(var i = contents_div.length-1; i>=0; i--){
            console.log(i);
            var msg = {
                'user':undefined,
                'sender':undefined,
                'type':undefined,
                'body':undefined,
                'id':undefined
            };
            var message_div = $(contents_div[i]).find("div");
            if(message_div){
                // console.log('message_div')
                var cm = $(message_div).data("cm");
                if(cm){
                    if(!cm.msgId)
                        continue
                    if(cm.msgId in YouChat.msgidcache)
                        break;
                    msg.id = cm.msgId;
                    msg.sender = cm.actualSender;
                    var user_h4 = $(contents_div[i]).find("h4");
                    if(user_h4){
                        msg.user = $(user_h4).text() || "【本人】或者未显示";
                    }
                    if(cm.msgType){
                        if(cm.msgType==="1"){
                            msg.type = "文字"
                            var body_pre = $(contents_div[i]).find("pre");
                            if(body_pre)
                                msg.body = $(body_pre).text();
                        }else if(cm.msgType==="47"){
                            //emotion
                            msg.type = "表情";
                        }else if(cm.msgType==="3"){
                            msg.type= "图片";
                            var img = $(contents_div[i]).find("img.msg-img");
                            if(img){
                                var src_base64 = $(img).attr("ng-src");
                                msg.imgencoding = "base64";
                                msg.imgsrc=src_base64;
                            }
                        }
                    }
                }
            }
            // console.log(msg);
            YouChat.msgidcache[msg.id]=undefined;
            msgs.push(msg);
        }
        msgs.reverse()
        // console.log(msgs);
        return msgs;
    },
    server: 'http://localhost:8000/rest/youchat/msg/',
    send: function(msgs){
        var query = {
            msgs: msgs
        };
        $.post(YouChat.server, query, function(data){
            if(data){
                console.log(data);
            }
        })
    },
    refresh: function(){
        var msgs = YouChat.getmsgs();
        // YouChat.send(msgs);
        console.info(msgs);
    },
    refreshinterval:undefined,
    refreshtime: 5000,
    start: function(){
        YouChat.refreshinterval = setInterval(YouChat.refresh, YouChat.refreshtime);
    },
    stop:function(){
        clearInterval(YouChat.refreshinterval);
    }
}


// var msgidcache = {
// }

// function generate_msgid(){
//     return Math.random().toString(36);
// }

// function clearcache(){
//     msgidcache = {}
// }

// function getmsgs(){
//     var contents_div = $("div[class='content']");
//     var msgs = [];
//     if(contents_div.length === 0)
//         return msgs;
//     console.log("length: "+contents_div.length.toString())
//     for(var i = contents_div.length-1; i>=0; i--){
//         console.log(i);
//         var msg = {
//             'user':undefined,
//             'sender':undefined,
//             'type':undefined,
//             'body':undefined,
//             'id':undefined
//         };
        
//         var message_div = $(contents_div[i]).find("div");
//         if(message_div){
//             // console.log('message_div')
//             var cm = $(message_div).data("cm");
//             if(cm){
//                 if(!cm.msgId)
//                     continue
//                 if(cm.msgId in msgidcache)
//                     break;
//                 msg.id = cm.msgId;
//                 msg.sernder = cm.actualSender;
//                 var user_h4 = $(contents_div[i]).find("h4");
//                 if(user_h4){
//                     msg.user = $(user_h4).text() || "本人";
//                 }
//                 if(cm.msgType){
//                     if(cm.msgType==="1"){
//                         msg.type = "文字"
//                         var body_pre = $(contents_div[i]).find("pre");
//                         if(body_pre)
//                             msg.body = $(body_pre).text();
//                     }else if(cm.msgType==="47"){
//                         //emotion
//                         msg.type = "表情";
//                     }else if(cm.msgType==="3"){
//                         msg.type= "图片";
//                         var img = $(content).find("img.msg-img");
//                         if(img){
//                             var src_base64 = $(img).attr("ng-src");
//                             msg.imgencoding = "base64";
//                             msg.imgsrc=src_base64;
//                         }
//                     }
//                 }
//             }
//         }
//         // console.log(msg);
//         msgidcache[msg.id]=undefined;
//         msgs.push(msg);
//     }
//     msgs.reverse()
//     console.log(msgs);
//     return msgs;
// }

// function refresh(){
//     var msgs = getmsgs();

// }

// refresh()
// var refresh_interval = setInterval(refresh,5000);
YouChat.start()