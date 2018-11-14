'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WindowsBashUtil } from './helper/windows';
import { BashUtil } from './helper/bash';
import { MacBashUtil } from './helper/macos';
import { InputBoxOptions, window } from 'vscode';
import { GitUtil } from './helper/gitutil';
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


    let skipTrack = vscode.commands.registerCommand('extension.skipTrack', async (fileUri) => {
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  assumeUnchangedCmd = 'cd "'+folderName+'" && git update-index --skip-worktree '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            assumeUnchangedCmd = 'cd "'+folderName+'" && git ls-files -s | xargs -0 git update-index --skip-worktree';
        }
        //console.log(assumeUnchangedCmd);
        bashUtil.executeCommand(assumeUnchangedCmd).then(function(result) {
            console.log(result);
        }).catch(function(e) {
            console.error(e.message);
        }); 
        vscode.window.showInformationMessage(fileName+ ' will be skipped by git!');
        
    })

    let unskipTrack = vscode.commands.registerCommand('extension.unskipTrack', async (fileUri) => {
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  assumeUnchangedCmd = 'cd "'+folderName+'" && git update-index --no-skip-worktree '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            assumeUnchangedCmd = 'cd "'+folderName+'" && git ls-files -s | xargs -0 git update-index --no-skip-worktree';
        }
        //console.log(assumeUnchangedCmd);
        bashUtil.executeCommand(assumeUnchangedCmd).then(function(result) {
            console.log(result);
        }).catch(function(e) {
            console.error(e.message);
        }); 
        vscode.window.showInformationMessage(fileName+ ' added back to git tracking!');
        
    })

    let untrack = vscode.commands.registerCommand('extension.untrack', async (fileUri) => {
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
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
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
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
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
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

    let skipList = vscode.commands.registerCommand('extension.skipList', async (fileUri) => {
        if(fileUri.fsPath == undefined) {
            fileUri = fileUri.resourceUri;
        }
        let filePath = fileUri.fsPath;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        var stats = fs.statSync(filePath);
        //console.log('isFile:'+stats.isFile());
        //console.log('isFolder:'+stats.isDirectory());
        let  listuntracked = 'cd "'+filePath+'" && git ls-files -v|grep "^s"|tr -d "s "';;
        
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
        //vscode.workspace.rootPath;
        vscode.window.showInformationMessage(fileName+ ' will not be tracked by git!');
    })

    let getGitConfig = vscode.commands.registerCommand('extension.getGitConfig', async (fileUri) => {
        if(fileUri.fsPath==undefined){
            fileUri = fileUri.resourceUri;
        }
        GitUtil.getGitUserAndMailConfig(vscode, bashUtil);
    })

    let getGitBranches = vscode.commands.registerCommand('extension.getGitBranches', async (fileUri) => {
            if(fileUri.fsPath==undefined){
            fileUri = fileUri.resourceUri;
        }
        GitUtil.gitGetBranches(vscode, bashUtil);
    })

    let setGitConfig = vscode.commands.registerCommand('extension.setGitConfig', async (fileUri) => {
        if(fileUri.fsPath==undefined){
            fileUri = fileUri.resourceUri;
        }
        
        let mailOption: InputBoxOptions = {
            prompt: "Enter user.email that you use for git account.",
            placeHolder: "user.email(eg. johndoe@gmail.com)"
        }

        let userNameOption: InputBoxOptions = {
            prompt: "Enter user.name that you use for git account.",
            placeHolder: "user.name(eg. John, Doe)"
        }
        
        window.showInputBox(mailOption).then(emailValue => {
            if (!emailValue) return;
            console.log(emailValue);
            if(emailValue!=''){
                window.showInputBox(userNameOption).then(userNameValue => {
                    if (!userNameValue) return;
                    console.log(userNameValue);
                    if(userNameValue!=''){
                        if(GitUtil.setGitUserAndMailConfig(vscode, emailValue, userNameValue, bashUtil)) {
                            vscode.window.showInformationMessage('Git config configured successfully!');
                        }
                        else {
                            vscode.window.showErrorMessage('Error in configuring Git config!');
                        }
                    }
                    // show the next dialog, etc.
                });
            }
            // show the next dialog, etc.
        });
    })

    let downloadGitDiff = vscode.commands.registerCommand('extension.downloadGitDiff', async (fileUri) => {
        if(fileUri.fsPath==undefined){
            fileUri = fileUri.resourceUri;
        }

        let folderName: InputBoxOptions = {
            prompt: "Enter a full folder path with name to be created.",
            placeHolder: "/mnt/somefolder for linux and C:\\users\\somefolder for windows",
            ignoreFocusOut:true
        }
        
        let firstHash: InputBoxOptions = {
            prompt: "Enter 1st has in reverse order",
            placeHolder: "it will the old hash id from where you have to start",
            ignoreFocusOut:true
        }

        let secondHash: InputBoxOptions = {
            prompt: "Enter 2nd has in reverse order",
            placeHolder: "it will the last hash id till where you need changes",
            ignoreFocusOut:true
        }

        
        window.showInputBox(folderName).then(folderName => {
            if (!folderName) return;
            console.log(folderName);
            if(folderName!=''){
                window.showInputBox(firstHash).then(firstHash => {
                    if (!firstHash) return;
                    console.log(firstHash);
                    if(firstHash!=''){
                        window.showInputBox(secondHash).then(secondHash => {
                            if(GitUtil.downloadDiff(vscode, folderName, firstHash,secondHash, bashUtil)) {
                                vscode.window.showInformationMessage(folderName);                                
                            }
                            else {
                                vscode.window.showErrorMessage('Error in Downloaded!');
                            }                           
                        });
                    }
                    // show the next dialog, etc.
                });
            }
            // show the next dialog, etc.
        });
    })





    context.subscriptions.push(track);
    context.subscriptions.push(untrack);
    context.subscriptions.push(untrack_list);
    context.subscriptions.push(ignoreAllDeleted);
    context.subscriptions.push(setGitConfig);
    context.subscriptions.push(getGitConfig);
}

// this method is called when your extension is deactivated
export function deactivate() {
}