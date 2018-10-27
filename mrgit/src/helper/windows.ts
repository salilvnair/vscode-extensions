import { BashUtil } from "./bash";

const cp = require('child_process')

export class WindowsBashUtil implements BashUtil {
    executeCommand(commandString:string) {
        return new Promise<string>(function(resolve, reject) {
            delete process.platform;
            process.platform = 'linux';
            cp.exec(commandString,{
                env: { PATH: 'C:\\progra~1\\git\\bin' },
                shell: 'C:\\progra~1\\git\\bin\\bash.exe'
              }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if(stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
                process.platform = 'win32';
            });
        });
       
    }
}

