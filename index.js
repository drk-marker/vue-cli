#!/usr/bin/env node

const program = require("commander");
const helpOptions = require("./lib/core/help.js");
const createCommands = require("./lib/core/create.js");
// 查看版本号
program.version(require("./package.json").version);

// 帮助和选项
helpOptions();

// 创建其他指令
createCommands();

// 需要对指令传来的参数进行解析
program.parse(process.argv);

// //拿取option里的参数
// const options = program.opts();
// // options的属性名和--后的字段有关和<>里无关
// console.log(options.dest);

// vue cli中就是通过inquirer库实现创建前选择react框架还是vue框架，或者是否使用router这判断选择询问的功能
