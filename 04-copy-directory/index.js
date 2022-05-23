const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

async function prepareFolder(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
  await mkdir(targetPath, { recursive: true });
}

async function copyFolder(srcPath, targetPath) {
  const srcData = await readdir(srcPath, { withFileTypes: true });
  srcData.forEach(async data => {
    if(data.isFile()) {
      await copyFile(path.join(srcPath, data.name), path.join(targetPath, data.name));
    } else if (data.isDirectory()) {
      await mkdir(`${targetPath}\\${data.name}`);
      await copyFolder(`${srcPath}\\${data.name}`, `${targetPath}\\${data.name}`);
    }
  });
}

(async function(){
  await prepareFolder(targetPath);
  await copyFolder(srcPath, targetPath);
})();
