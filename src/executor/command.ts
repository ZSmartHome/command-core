export interface Command {
  key: string;
  label: string;
  description: string;
}

export const asCommand = (
  key: string,
  label: string = key,
  description: string = label): Command => ({
  key, label, description
});

export const toCommands = <T extends Command, V>(
  raw: { [key: string]: V },
  factory: (key: string, value: V) => T) => {
  const commands: T[] = [];
  for (const key of Object.keys(raw)) {
    const value = raw[key];
    commands.push(factory(key, value))
  }
  return commands;
}