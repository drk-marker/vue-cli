//开发时代码这个文件夹叫src，如果是库文件夹叫lib，包含core（核心代码）和utils（工具类）
const program = require("commander");
const {
  createProjectAction,
  addCpnAction,
  addPageAndRoute,
  addStore,
} = require("./actions");
const createCommands = () => {
  // create <project> [others...]默认最前面就会加why，project是指创建的文件夹名称
  // why create demo abc ccc ,demo对应project，abc ccc对应后面的others...,...表示后面是个变长的其他参数
  program
    .command("create <project> [others...]")
    .description("clone repository into a folder")
    .action(createProjectAction);

  // 添加租金
  // [-d src/component]表示这个参数可以跟也可以不跟
  program
    .command("addcpn <name> [others...]")
    .description(
      "add a component, 例如：why addcpn HelloWorld [-d src/component]"
    )
    .action((name) => {
      // 因为之前在program.option里定义了-d，所以输入why ... -d ...指令的时候是可以取到dest的
      addCpnAction(name, program._optionValues.dest || "src/components");
    });

  // 添加page
  program
    .command("addpage <name> [others...]")
    .description(
      "add a addpage and router config, 例如：why addpage HelloWorld [-d src/page]"
    )
    .action((page) => {
      // 因为之前在program.option里定义了-d，所以输入why ... -d ...指令的时候是可以取到dest的
      addPageAndRoute(page, program._optionValues.dest || `src/pages/${page}`);
    });

  // 添加store
  program
    .command("addstore <name> [others...]")
    .description("add a addstore, 例如：why addstore HelloWorld [-d src/store]")
    .action((store) => {
      // 因为之前在program.option里定义了-d，所以输入why ... -d ...指令的时候是可以取到dest的
      addStore(
        store,
        program._optionValues.dest || `src/store/modules/${store}`
      );
    });
};

module.exports = createCommands;
