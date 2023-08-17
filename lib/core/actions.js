const { promisify } = require("util");
const path = require("path");

// 因为download-git-repo这个库执行时机通过回调函数返回值来判断，不能像promise链式调用，这样就会造成
// 回调地狱，使用util核心模块里的promisify解决这个问题，原理就是在download外面套了一层promise等最后
// download第四个参数function有返回值时去执行后续操作，一般如果有err则直接reject,否则直接resolve
const download = promisify(require("download-git-repo"));
// const open = require("open");

const { vueRepo } = require("../config/repo-config");
const { commandSpawn } = require("../utils/terminal");
const { compile, writeToFile, createDirSync } = require("../utils/utils");
// async会返回一个Promise,但是create.js里program.action接受的可以时没有返回值的函数或者返回promise的函数
const createProjectAction = async (project) => {
  console.log("why helps you create your project~");
  // 1.clone项目，通过download-git-repo库实现，vue也是使用download-git-repo下载模板
  // vueRepo下载地址，project下载到文件夹的地址，{ clone: true }除了代码，git文件夹也会一起下载下来
  // 为了把此处异步变成同步，使用async await使代码更优雅
  await download(vueRepo, project, { clone: true });

  // 2.npm install
  // 在windows系统上虽然看起来终端输入的都是npm ...但实际执行的是npm.cmd，所以此处需要判断是否是windows系统
  // 还是MAC系统process.platform = "win32"则是win,通过commandSpawn执行时是不会自动加上npm.cmd的
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  await commandSpawn(command, ["install"], { cwd: `./${project}` });

  // 3.npm run serve,但是这里有个问题，npm run serve之后终端面板会一直显示serve信息，也就不会中断进程
  // 就会导致后面的打开浏览器阻塞，有两个方法：1.把open放这个代码前面 2.去掉await,也就不会阻塞后面代码
  await commandSpawn(command, ["run", "serve"], { cwd: `./${project}` });
  // 4.打开浏览器(借助open库,npm i open)
  // open("http://localhost:8080/");
};

const addCpnAction = async (name, dest) => {
  console.log("why helps you create your project~");

  // why指令创建组件流程，写入router，store也与创建组件流程相同，流程如下
  // 1.有对应的ejs模板，用来生成.vue文件，在bin的templates里实现

  // 2.编译ejs模板,得到result字符串
  const result = await compile("vue-component.ejs", {
    name,
    lowerName: name.toLowerCase(),
  });
  // 3.将result字符串写入到.vue文件中,并将vue文件放到对应的文件夹中
  const targetPath = path.resolve(dest, `${name}.vue`);
  writeToFile(targetPath, result);
};

// 添加组件和路由
const addPageAndRoute = async (name, dest) => {
  const date = {
    name,
    lowerName: name.toLowerCase(),
  };
  const pageResult = await compile("vue-component.ejs", date);
  const routeResult = await compile("vue-router.ejs", date);
  if (createDirSync(dest)) {
    const targetPagePath = path.resolve(dest, `${name}.vue`);
    const targetRoutePath = path.resolve(dest, `router.js`);
    writeToFile(targetPagePath, pageResult);
    writeToFile(targetRoutePath, routeResult);
  }
};

// 添加store
// 添加组件和路由
const addStore = async (name, dest) => {
  const storeResult = await compile("vue-store.ejs", {});
  const typesResult = await compile("vue-types.ejs", {});
  if (createDirSync(dest)) {
    const targetstorePath = path.resolve(dest, `${name}.js`);
    const targetTypePath = path.resolve(dest, `type.js`);
    writeToFile(targetstorePath, storeResult);
    writeToFile(targetTypePath, typesResult);
  }
};
module.exports = {
  createProjectAction,
  addCpnAction,
  addPageAndRoute,
  addStore,
};

/* 
download-git-repo文档
https://www.npmjs.com/package/download-git-repo
download(地址, 拉取路径, 回调函数)
*/
