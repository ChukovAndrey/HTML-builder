const fs = require('fs');
const path = require('path');
const process = require('process');

const absolutePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(absolutePath);

process.stdout.write('Type some data. Type exit or use ctrl+c to exit\n');

process.stdin.on('data', data => {
  const chunk = data.toString();
  if (chunk.trim() === 'exit') process.exit();
  writeStream.write(chunk);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => process.stdout.write('Exit program'));