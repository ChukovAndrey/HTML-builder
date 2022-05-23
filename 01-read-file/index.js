const fs = require('fs');
const path = require('path');

const absolutePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(absolutePath);
readStream.on('data', data => {
  const chunk = data.toString();
  console.log(chunk);
});