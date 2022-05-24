const fs = require('fs');
const path = require('path');
const { readdir, copyFile, rm, mkdir, readFile } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

async function prepareFolder(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
  await mkdir(targetPath, { recursive: true });
}

async function mergeStyles(srcPath, targetPath) {
  const styles = [];
  const stylePath = path.join(targetPath, 'style.css');
  const writeStream = fs.createWriteStream(stylePath);
  const files = await readdir(srcPath, { withFileTypes: true });
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
}

async function copyFolder(srcPath, targetPath) {
  const srcData = await readdir(srcPath, { withFileTypes: true });
  srcData.forEach(async data => {
    if (data.isFile()) {
      await copyFile(path.join(srcPath, data.name), path.join(targetPath, data.name));
    } else if (data.isDirectory()) {
      await mkdir(`${targetPath}\\${data.name}`);
      await copyFolder(`${srcPath}\\${data.name}`, `${targetPath}\\${data.name}`);
    }
  });
}



async function generateHTML() {
  const writeStream = fs.createWriteStream(path.join(distPath, 'index.html'));
  const files = await readdir(componentsPath, { withFileTypes: true });
  let html = await readFile(templatePath);
  for (const file of files) {
    if (file.isFile() && file.name.split('.')[1] === 'html') {
      const component = file.name.split('.')[0];
      const data = await readFile(path.join(__dirname, 'components', file.name));
      html = html.toString().replace(`{{${component}}}`, data.toString());
    }
  }
  writeStream.write(html);
}

(async function(){
  await prepareFolder(distPath);
  await prepareFolder(`${distPath}\\assets`);
  await copyFolder(assetsPath, `${distPath}\\assets`);
  await mergeStyles(stylesPath, distPath);
  await generateHTML();
})();