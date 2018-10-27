import { BashUtil } from "./bash";

const cp = require('child_process')

export class MacBashUtil implements BashUtil{
    executeCommand(commandString:string) {
        return new Promise<string>(function(resolve, reject) {
            cp.exec(commandString, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if(stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
            });
        });
       
    }
}