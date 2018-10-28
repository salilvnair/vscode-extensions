'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WindowsBashUtil } from './helper/windows';
import { BashUtil } from './helper/bash';
import { MacBashUtil } from './helper/macos';
var path = require("path");
var fs = require('fs');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mrgit" is now active!');

    //declare a bashUtil interface whose implementation will be chosen 
    //based on the platform on which the extension is running in
    let bashUtil:BashUtil;

    var osvar = process.platform;

    if (osvar == 'darwin') {
        bashUtil = new MacBashUtil();
    }else if(osvar == 'win32'){
        bashUtil = new WindowsBashUtil();
    }

    let untrack = vscode.commands.registerCommand('extension.untrack', async (fileUri) => {
        console.log(process.env.VSCODE_CWD);
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  assumeUnchangedCmd = 'cd "'+folderName+'" && git update-index --assume-unchanged '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            assumeUnchangedCmd = 'cd "'+folderName+'" && git ls-files -z | xargs -0 git update-index --assume-unchanged';
        }
        //console.log(assumeUnchangedCmd);
        bashUtil.executeCommand(assumeUnchangedCmd).then(function(result) {
            console.log(result);
        }).catch(function(e) {
            console.error(e.message);
        }); 
        vscode.window.showInformationMessage(fileName+ ' will not be tracked by git!');
        
    })

    let track = vscode.commands.registerCommand('extension.track', async (fileUri) => {
        //console.log(fileUri);
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  noassumeUnchangedCmd = 'cd "'+folderName+'" && git update-index --no-assume-unchanged '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            noassumeUnchangedCmd = 'cd "'+folderName+'" && git ls-files -z | xargs -0 git update-index --no-assume-unchanged';
        }
        //console.log(noassumeUnchangedCmd);
        bashUtil.executeCommand(noassumeUnchangedCmd).then(function(result) {
            console.log(result);
        }).catch(function(e) {
            console.error(e.message);
        }); 
    
        vscode.window.showInformationMessage(fileName+ ' added back for git tracking!');
    })

    let untrack_list = vscode.commands.registerCommand('extension.untrackList', async (fileUri) => {
        //console.log(fileUri);
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  listuntracked = 'cd "'+filePath+'" && git ls-files -v|grep "^h"|tr -d "h "';;
        
        if(stats.isFile()){
            folderName = folderName.replace(' ','\ ');
            listuntracked = 'cd "'+folderName+'" && git ls-files -v|grep "^h"|tr -d "h "';
        }
        //console.log(listuntracked);
        bashUtil.executeCommand(listuntracked).then(function(result) {
            if(result!=undefined) {
                let untrackedFiles =  result.split(/\r?\n/);
                untrackedFiles.forEach(unTrackedFileName => {
                 vscode.window.showInformationMessage(unTrackedFileName);
                }); 
            }
        }).catch(function(e) {
            console.error(e.message);
        }); 
    })

    let ignoreAllDeleted = vscode.commands.registerCommand('extension.ignoreAllDeleted', async (fileUri) => {
        if(fileUri.fsPath==undefined){
            fileUri = fileUri.resourceUri;
        }
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        let  ignoreDeletedCmd = 'cd "'+folderName+'" && git ls-files --deleted -z | git update-index --assume-unchanged -z --stdin';
        bashUtil.executeCommand(ignoreDeletedCmd).then(function(result) {
            console.log(result);
        }).catch(function(e) {
            console.error(e.message);
        }); 

        vscode.window.showInformationMessage(fileName+ ' will not be tracked by git!');
    })
    context.subscriptions.push(track);
    context.subscriptions.push(untrack);
    context.subscriptions.push(untrack_list);
    context.subscriptions.push(ignoreAllDeleted);
}

// this method is called when your extension is deactivated
export function deactivate() {
}