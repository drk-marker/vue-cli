// 用来编译ejs模板,npm i ejs要使用到ejs库
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const compile = (templateName, data) => {
  // 拿到上一层文件夹里的template里的文件
  const templatePosition = `../templates/${templateName}`;
  const templatePath = path.resolve(__dirname, templatePosition);

  return new Promise((resolve, reject) => {
    // renderFile渲染文件,第一个参数需要传被渲染文件的绝对路径，第二个参数是传入的data数据，第三个可选项，可不传
    // 第四个传回调函数,此处也可以参考actions里的promisify做一个转化，但一般需要很多操作的时候不建议使用promisify
    ejs.renderFile(templatePath, { data }, {}, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      resolve(result);
    });
  });
};

// source/component/profile
const createDirSync = (pathName) => {
  if (fs.existsSync(pathName)) {
    return true;
  } else {
    // 判断一下是否存在父路径
    if (createDirSync(path.dirname(pathName))) {
      fs.mkdirSync(pathName);
      return true;
    }
  }
};
const writeToFile = (path, content) => {
  // fs的writeFile,writeFileSync方法也都可用
  // 因为在创建页面(addpage)的时候,可能会出现只写why addpage app不加-d或者why addpage app -d source/component/profile
  // 这种完全不存在的路径，这就需要在写入的时候进行一个判断是否存在需要写入到的文件夹，如果没有进行递归创建
  return fs.promises.writeFile(path, content);
};
module.exports = {
  compile,
  writeToFile,
  createDirSync,
};
