/* 
* @Author: LiSnB
* @Date:   2015-06-18 15:16:13
* @Last Modified by:   lisnb
* @Last Modified time: 2016-03-28 11:00:00
*/

'use strict';

function toggle(){
    chrome.storage.local.get('on', function(value){
        if(value == undefined || value.on === undefined || value.on === false){
            chrome.storage.local.set({
                "on" : true
            });
            chrome.browserAction.setIcon({
                "path" : {
                    "16": "icons/youchat16.png",
                    "19": "icons/youchat19.png",
                    "38": "icons/youchat76.png",
                    "48": "icons/youchat48.png",
                    "128": "icons/youchat128.png"
                }
            });
            chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {command: "toggle", on:true}, function(response){
                    console.log(response.msg);
                })
            });
        } else {
            chrome.storage.local.set({
                "on": false
            });
            chrome.browserAction.setIcon({
                "path": "icons/youchatoff.png"
            });
            chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {command: "toggle", on:false}, function(response){
                    console.log(response.msg);
                })
            });
        }
        
    })
}

chrome.browserAction.onClicked.addListener(toggle);