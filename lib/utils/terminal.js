/* 
    执行终端命令代码
*/
// 一般主进程都会执行js代码，而终端指令会另外新建一个进程并在里面执行
// 执行终端命令使用exec, spawn，exec相当于对spawn的一个封装，spawn更偏向底层
const { exec, spawn } = require("child_process");

// args里放的是command(执行命令)，args(参数)，options（可选项，比如cwd是选择当前指令在哪个目录里执行）
const commandSpawn = (...args) => {
  return new Promise((resolve, reject) => {
    // 获取到childProcess进程，进程中会有很多执行命令的过程中的打印信息，但是其实在终端上并不会显示这些
    // 信息，但其实是希望用户可以实时看到这些下载信息的，所以要把子进程的流放到主进程的流中
    const childProcess = spawn(...args);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);

    // 判断是否执行完，而决定继续向下执行还是阻塞
    childProcess.on("close", () => {
      resolve();
    });
  });
};
module.exports = { commandSpawn };
