const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const srcPath = path.join(__dirname, 'styles');
const targetPath = path.join(__dirname, 'project-dist', 'bundle.css');
const styles = [];

const writeStream = fs.createWriteStream(targetPath);

readdir(srcPath, { withFileTypes: true })
  .then(async files => {
    for await (let file of files) {
      if (file.isFile() && file.name.split('.')[1] === 'css') {
        const filePath = path.join(srcPath, file.name);
        const readStream = fs.createReadStream(filePath);
        for await (let chunk of readStream) {
          styles.push(chunk.toString());
        }
      }
    }
    writeStream.write(styles.join('\n'));
  })
  .catch(err => {
    console.log(err);
  });