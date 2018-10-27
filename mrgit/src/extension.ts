'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const cp = require('child_process')
var path = require("path");
var fs = require('fs');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mrgit" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello1', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
       // vscode.window.showInformationMessage('Hello World!');
       let editor = vscode.window.activeTextEditor;
       if (!editor) {
           return; // No open text editor
       }

       let selection = editor.selection;
       let text = editor.document.getText(selection);

       var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
       var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);

       // Display a message box to the user

       vscode.window.showInformationMessage('Selected characters: ' + text.length);
    });
    let track = vscode.commands.registerCommand('extension.untrack', async (fileUri) => {
        console.log(fileUri);
        let filePath = fileUri.path;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        console.log(folderName);
        console.log(fileName);
        var stats = fs.statSync(filePath);
        console.log('isFile:'+stats.isFile());
        console.log('isFolder:'+stats.isDirectory());
        let  assumeUnchangedCmd = 'cd '+folderName+' && git update-index --assume-unchanged '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            assumeUnchangedCmd = 'cd '+folderName+' && git ls-files -z | xargs -0 git update-index --assume-unchanged';
        }
        console.log(assumeUnchangedCmd);
        cp.exec(assumeUnchangedCmd, (err, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err) {
                console.log('error: ' + err);
            }
        });
        vscode.window.showInformationMessage(fileName+ ' will not be tracked by git!');
        
    })

    let untrack = vscode.commands.registerCommand('extension.track', async (fileUri) => {
        console.log(fileUri);
        let filePath = fileUri.path;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        console.log(filePath);
        console.log(fileName);
        var stats = fs.statSync(filePath);
        console.log('isFile:'+stats.isFile());
        console.log('isFolder:'+stats.isDirectory());
        let  noassumeUnchangedCmd = 'cd '+folderName+' && git update-index --no-assume-unchanged '+fileName+' --verbose';
        
        if(stats.isDirectory()){
            folderName = filePath;
            noassumeUnchangedCmd = 'cd '+folderName+' && git ls-files -z | xargs -0 git update-index --no-assume-unchanged';
        }
        console.log(noassumeUnchangedCmd);
        cp.exec(noassumeUnchangedCmd, (err, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err) {
                console.log('error: ' + err);
            }
        });
        vscode.window.showInformationMessage(fileName+ ' added back for git tracking!');
    })

    let untrack_list = vscode.commands.registerCommand('extension.untrackList', async (fileUri) => {
        console.log(fileUri);
        let filePath = fileUri.path;
        let folderName = path.dirname(filePath);
        let fileName = path.basename(filePath);
        console.log(folderName);
        console.log(fileName);
        
        console.log(filePath);
        console.log(fileName);
        var stats = fs.statSync(filePath);
        console.log('isFile:'+stats.isFile());
        console.log('isFolder:'+stats.isDirectory());
        let  listuntracked = 'cd '+filePath+' && git ls-files -v|grep "^h"|tr -d "h "';;
        
        if(stats.isFile()){
            listuntracked = 'cd '+folderName+' && git ls-files -v|grep "^h"|tr -d "h "';
        }
        console.log(listuntracked);
        cp.exec(listuntracked, (err, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            if(stdout!=undefined) {
               let untrackedFiles =  stdout.split(/\r?\n/);
               untrackedFiles.forEach(unTrackedFileName => {
                vscode.window.showInformationMessage(unTrackedFileName);
               });
               
            }
            
            
            console.log('stderr: ' + stderr);
            if (err) {
                console.log('error: ' + err);
            }
        });
       
    })

    context.subscriptions.push(disposable);
    context.subscriptions.push(track);
    context.subscriptions.push(untrack);
}

// this method is called when your extension is deactivated
export function deactivate() {
}