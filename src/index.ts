import {getExecutor as getTVExecutor} from './commands/tv';
import {getExecutor as getLightExecutor} from './commands/light';

export const tvExecutor = getTVExecutor()
export const tv = tvExecutor.run.bind(tvExecutor)
export const tvCommands = tvExecutor.commands

export const lightExecutor = getLightExecutor()
export const light = lightExecutor.run.bind(lightExecutor)
export const lightCommands = lightExecutor.commands

export {ExecutionError} from './errors/execution-error';
export {shell, split} from './util';