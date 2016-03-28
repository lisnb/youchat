/*
* @Author: lisnb.pc
* @Date:   2016-03-25 20:23:24
* @Last Modified by:   lisnb
* @Last Modified time: 2016-03-28 18:34:18
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
            var content = contents_div[i];
            console.log(i);
            var msg = {
            };
            
            var bubble_div = $(content).find("div");
            if(bubble_div){
                // console.log('bubble_div')
                var cm = $(bubble_div).data("cm");
                if(cm){
                    if(!cm.msgId)
                        continue
                    if(cm.msgId in YouChat.msgidcache)
                        break;
                    msg.id = cm.msgId;
                    msg.sender = cm.actualSender;
                    var user_h4 = $(content).find("h4.nickname");
                    if(user_h4){
                        msg.user = $(user_h4).text() || "[本人或者未显示]";
                    }
                    msg.group = $("a.title_name").text()||"[获取群名称失败]";
                    if(cm.msgType){
                        if(cm.msgType==="1"){
                            msg.type = "文字;"
                            msg.typecode = 1;
                            var body_pre = $(content).find("pre");
                            if(body_pre)
                                msg.body = $(body_pre).text();
                        }else if(cm.msgType==="47"){
                            //emotion
                            msg.type = "表情";
                            msg.typecode = 47;
                        }else if(cm.msgType==="3"){
                            msg.type= "图片";
                            msg.typecode = 3;
                            var img = $(content).find("img.msg-img");
                            if(img){
                                var src_base64 = $(img).attr("ng-src");
                                msg.imgencoding = "base64";
                                msg.imgsrc=src_base64;
                            }
                        }else if(cm.msgType==="49"){
                            //朋友圈分享，链接分享
                            msg.type="链接";
                            msg.typecode = 49;
                            var a = $(bubble_div).find("div>a");
                            if(a){
                                msg.share = {
                                    title: $(a).find("h4.title").text() || "[无标题]",
                                    desc: $(a).find("p.desc").text() || "[无摘要]",
                                    href: url('?requrl', $(a).attr('href')) || "[无链接]"

                                }
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
    server: 'https://localhost:8000/rest/youchat/msg/',
    sendtoserver: function(msgs){
        var query = {
            msgs: msgs
        };
        $.post(YouChat.server, query, function(data){
            if(data){
                console.log(data);
            }
        })
    },
    sendtest: function(msgs){
        console.log(msgs)
    },
    refresh: function(){
        var msgs = YouChat.getmsgs();
        YouChat.sendtest(msgs);
    },
    refreshinterval:undefined,
    refreshtime: 5000,
    start: function(){
        YouChat.msgidcache = {};
        YouChat.refreshinterval = setInterval(YouChat.refresh, YouChat.refreshtime);
        console.log('starting...')
    },
    stop:function(){
        clearInterval(YouChat.refreshinterval);
        console.log('stopping...')
    }
}

// YouChat.start()
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(sender.tab? 
            "from content script:" + sender.tab.url:
            "from the extension"
        );
        console.log(request);
        if(!request.command){
            sendResponse({
                msg: "no command"
            });
            return ;
        }
        if(request.command === "toggle"){
            if(request.on === true){
                YouChat.start();
                sendResponse({
                    "msg": "YouChat started"
                });
            }else{
                YouChat.stop();
                sendResponse({
                    "msg": "YouChat stopped"
                });
            }
        } else {
            sendResponse({
                "msg": "unrecognized command"
            });
        }
    }
)



