export interface BashUtil {
    executeCommand(commandString:string): Promise<string>;
}