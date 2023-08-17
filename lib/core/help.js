const program = require("commander");
const helpOptions = () => {
  // 配置why -v的值，第一个参数是输入指令后回复的值，第二个参数是编辑除了-V，--version(这两个默认指令)其他
  // 指令，但是会对-V进行覆盖，除非加一行上面的代码，一般不进行修改，--help也是默认配置
  // program.version(require("./package-lock.json").version, "-v,--version");

  // 下面代码不仅是设置指令，如果出现<dest>，<framework>之类，也可以在program里取到这些变量
  program.option("-w --why", "a why cli");
  program.option(
    "-d --dest <dest>",
    "a destination folder,例如：-d /src/components"
  );
  program.option("-f --framework <framework>", "your framework");

  // on监听某一指令
  program.on("--help", function () {
    console.log("");
    console.log("Other:");
    console.log(" Other options~");
  });
};
module.exports = helpOptions;
