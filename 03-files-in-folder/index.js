const fs = require('fs');
const path = require('path');
const {readdir} = require('fs/promises');

const absolutePath = path.join(__dirname, 'secret-folder');

readdir(absolutePath, { withFileTypes: true })
  .then(files => {
    for (let file of files) {
      if (file.isFile()) {
        const fileName = file.name.split('.')[0];
        const fileExt = file.name.split('.')[1];
        const filePath = path.join(absolutePath, file.name);
        fs.stat(filePath, (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`${fileName} - ${fileExt} - ${stats.size / 1024}kb`);
          }
        });
      }
    }
  })
  .catch(err => {
    console.log(err);
  });