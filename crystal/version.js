
var async = require('async')
var exec = require('child_process').exec;
var fs = require("fs"); 
var platform; //平台
var env; //环境


var basePath = "/Users/nickxin/WorkSpace/svn/crystalBall/";
var arguments = process.argv.splice(2);
platform = arguments[0];
//env = arguments[1];
console.log("env:"+env) 
console.log("platform:"+platform) 

var svnPath = basePath+platform+'/'; //目标代码仓库地址

var configPath = "src/assets/config/environment.json";

//svn 更新
exec('svn update '+svnPath, function(err,stdout,stderr){
    if(err) {
        console.log('svn update error');
    } else {
        console.log(stdout)
        syncFileToSvn();
        //readConfig()
    }
}); 

//读配置json
function readConfig(){

    fs.readFile(configPath,'utf-8',function(err,data){
        if(err){
            console.log("read config error");
        }else{
            var object = JSON.parse(data) 
            //回写json
            writeJSON(JSON.stringify(object, null, 4),function(){
                syncFileToSvn()
            })
        }
    })
}

function writeJSON(content,cb){
    fs.writeFile("src/assets/config/development.json",content,function(err){
        if(err) throw err;
        console.log('config write finished');
    });
}

//同步文件到对应的svn仓库
function syncFileToSvn(){
    //先更新
    //svn update
    console.log("syncFileToSvn start")
    var cdCmd = function(cb){
        exec('cd '+svnPath, function(err,stdout,stderr){
            if(err) {
                console.log('cd '+svnPath+' error');
            } else {
                console.log('cd '+svnPath+' complete');
                console.log(stdout)
                cb(null,null);
            }
        });
    }

    var updateCmd = function(cb){
        exec('svn update '+svnPath, function(err,stdout,stderr){
            if(err) {
                console.log('svn update '+svnPath+' error');
            } else {
                console.log('svn update '+svnPath+'complete');
                console.log(stdout)
                cb(null,null);
            }
        });
    }
    var cmdList = [updateCmd]
    var fileList = ["version.js","tslint.json","tsconfig.json","README.md","package.json","package-lock.json","build.cmd","angular.json","404.html","e2e","src"]
    var len = fileList.length
    //rsync -av --exclude ".*"  ${WORKSPACE}/assets/apps/vxmobile/www/   ~/projects/svn/vx_hcm_android_package
    for(let i=0;i<len;i++){
        var path = fileList[i]
        var cmd = 'rsync -av --exclude ".*"  '+path+'   '+svnPath
        cmdList.push(createRsyncCmd(cmd))
    }

    var addCmdStr = 'svn add '+svnPath+' --force';
    var commitCmdStr = 'svn commit '+svnPath+' -m "commit by script"';
    var addCmd = function(cb){
        exec(addCmdStr, function(err,stdout,stderr){
             console.log(addCmdStr)
            if(err) {
                console.log(addCmdStr+' error');
                console.log(err)
            } else {
                console.log(addCmdStr+' complete');
                console.log(stdout)
                cb(null,null);
            }
        });
    }

    var commitCmd = function(cb){
        exec(commitCmdStr, function(err,stdout,stderr){
            console.log(commitCmdStr)
            if(err) {
                console.log('svn commit error');
            } else {
                console.log(commitCmdStr+' complete');
                console.log(stdout)
                cb(null,null);
            }
        });
    }
    //cmdList.push(cdCmd)
    cmdList.push(addCmd)
    cmdList.push(commitCmd)
    async.series(cmdList,function(){
         console.log("syncFileToSvn execute complete");
    })

}


function createRsyncCmd(cmd){
    return function(cb){
        console.log(cmd)
         exec(cmd, function(err,stdout,stderr){
            if(err) {
                console.log(err);
            } else {
                console.log(stdout)
            }
            cb(null,cmd);
        });
    }
}



