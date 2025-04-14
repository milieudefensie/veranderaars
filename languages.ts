import { join } from 'path';
import { readdirSync, lstatSync } from 'fs';

export const defaultLanguage = 'nl';

export const languages = readdirSync(join(__dirname, 'locales')).filter((fileName) => {
  const joinedPath = join(join(__dirname, 'locales'), fileName);
  const isDirectory = lstatSync(joinedPath).isDirectory();
  return isDirectory;
});

languages.splice(languages.indexOf(defaultLanguage), 1);
languages.unshift(defaultLanguage);
