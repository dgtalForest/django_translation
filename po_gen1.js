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

// Update translations in the new .po file based on the old one
function updateTranslations(oldPoData, newPoData) {
  const oldTranslations = oldPoData.translations;
  const newTranslations = newPoData.translations;

  for (const context in newTranslations) {
    if (!oldTranslations[context]) continue;

    for (const key in newTranslations[context]) {
      if (key === '') continue; // Skip headers

      if (oldTranslations[context][key] && oldTranslations[context][key].msgstr[0]) {
        // Copy the translation from old to new if msgid matches
        newTranslations[context][key].msgstr[0] = oldTranslations[context][key].msgstr[0];
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
const outputPoPath = './updated_new.po'; // Replace with the desired output .po file path

main(oldPoPath, newPoPath, outputPoPath);
