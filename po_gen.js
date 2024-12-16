import fs from 'fs';
import gettextParser from 'gettext-parser';

// Load a .po file and parse it
function loadPoFile(filePath) {
  const poContent = fs.readFileSync(filePath, 'utf8');
  return gettextParser.po.parse(poContent);
}

// Write a .po file from the parsed data
function writePoFile(filePath, poData) {
  const output = gettextParser.po.compile(poData);
  fs.writeFileSync(filePath, output);
  console.log(`Updated .po file written to: ${filePath}`);
}

// Format msgstr to indicate missing translation
// Format msgstr to indicate missing translation
function formatMsgstr(msgid) {
    // Trim the msgid and add the "TRANSLATE:" prefix
    let msgstr = `TRANSLATE: ${msgid.trim()}`;
  
    // Preserve leading newline if present
    if (msgid.startsWith('\n')) {
      msgstr = `\n${msgstr}`;
    }
  
    // Preserve trailing newline if present
    if (msgid.endsWith('\n')) {
      msgstr = `${msgstr}\n`;
    }
  
    return msgstr;
  }
  
// Update translations in the new .po file
function updateTranslations(oldPoData, newPoData) {
  const oldTranslations = oldPoData.translations;
  const newTranslations = newPoData.translations;

  for (const context in newTranslations) {
    if (!oldTranslations[context]) continue;

    for (const key in newTranslations[context]) {
      const newEntry = newTranslations[context][key];
      if (!newEntry.msgid || key === '') continue; // Skip headers or invalid entries

      const oldEntry = oldTranslations[context][key];
      if (oldEntry && oldEntry.msgstr[0]) {
        // Copy translation from old to new
        newEntry.msgstr[0] = oldEntry.msgstr[0];
      } else {
        // Mark as untranslated with the formatted msgstr
        newEntry.msgstr[0] = formatMsgstr(newEntry.msgid);
      }
    }
  }
}

// Main function
function main(oldPoPath, newPoPath, outputPoPath) {
  console.log('Loading old .po file...');
  const oldPoData = loadPoFile(oldPoPath);

  console.log('Loading new .po file...');
  const newPoData = loadPoFile(newPoPath);

  console.log('Updating translations...');
  updateTranslations(oldPoData, newPoData);

  console.log('Writing updated .po file...');
  writePoFile(outputPoPath, newPoData);

  console.log('Done!');
}

// Paths to the old, new, and output .po files
const oldPoPath = './old.po'; // Replace with the path to your old .po file
const newPoPath = './new.po'; // Replace with the path to your new .po file
const outputPoPath = './po_default.po'; // Replace with the desired output .po file path

main(oldPoPath, newPoPath, outputPoPath);
