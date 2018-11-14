import { BashUtil } from "./bash";

export class GitUtil {

    static setGitUserAndMailConfig(vscode:any, email:string, user:string, bashUtil:BashUtil){
        let gitRootPath = this.getRootDirectory(vscode,bashUtil);
        let setGitUserAndMailConfigCmd = 'cd "'+gitRootPath+'" && git config user.name '+user+' && git config user.email '+email;
        let executedSuccessfully:boolean = false;
        bashUtil.executeCommand(setGitUserAndMailConfigCmd).then(function(result) {
         }).catch(function(e) {
             console.error(e);
         }); 
         executedSuccessfully = true;
         return executedSuccessfully;
    }

    
    static downloadDiff(vscode:any, folderName:string, firstHash:string,secondHash:string, bashUtil:BashUtil){
        let gitRootPath = this.getRootDirectory(vscode,bashUtil);
        let setGitDiffDownload = 'cd "'+gitRootPath+'" && rm -rf "'+folderName+'" && mkdir "'+folderName+'"  && cp $(git diff '+firstHash+' '+secondHash+' --name-only) "'+folderName+'"';
        let executedSuccessfully:boolean = false;
         bashUtil.executeCommand(setGitDiffDownload).catch(function(e) {
             console.error(e);
         }); 
         vscode.commands.executeCommand("vscode.openFolder", folderName);
         executedSuccessfully = true;
         return executedSuccessfully;
    }

    static getGitUserAndMailConfig(vscode:any, bashUtil:BashUtil){
        let gitRootPath = this.getRootDirectory(vscode,bashUtil);
        let newCmd = 'cd "'+gitRootPath+'" && git config user.name && git config user.email';
        let executedSuccessfully:boolean = false;
        bashUtil.executeCommand(newCmd).then(function(result) {
            let userMailArray =  result.split(/\r?\n/);
            vscode.window.showInformationMessage('user.name: '+userMailArray[0]);
            vscode.window.showInformationMessage('user.email: '+userMailArray[1]);
         }).catch(function(e) {
             console.error(e);
         }); 
         executedSuccessfully = true;
         return executedSuccessfully;
    }

    static gitGetBranches(vscode:any, bashUtil:BashUtil){
        let gitRootPath = this.getRootDirectory(vscode,bashUtil);
        let gitListRemoteBranchCmd = 'cd "'+gitRootPath+'" && git branch -r';
        let executedSuccessfully:boolean = false;
        bashUtil.executeCommand(gitListRemoteBranchCmd).then(function(result) {
            let userMailArray =  result.split(/\r?\n/);
            userMailArray.forEach(branchName => {
                vscode.window.showInformationMessage(branchName);
            });
         }).catch(function(e) {
             console.error(e);
         }); 
         executedSuccessfully = true;
         return executedSuccessfully;
    }

    static getRootDirectory(vscode:any, bashUtil:BashUtil):string {
        let vsCodeRootPath = vscode.workspace.rootPath;
        let getRootDirCmd = 'cd "'+vsCodeRootPath+'" && git rev-parse --show-toplevel';
        let gitRoot = vsCodeRootPath;
        bashUtil.executeCommand(getRootDirCmd).then(function(result) {
             console.log(result);
             gitRoot = result;
         }).catch(function(e) {
             console.error(e.message);
         }); 
        return gitRoot; 
    }
}