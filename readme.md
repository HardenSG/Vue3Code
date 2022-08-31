虚拟Dom就是一个对象，用来描述真实的Dom
Vue1是没有虚拟dom的，所以它的性能很低，
vue采用Monorepo管理模块
组成：
![](./img/vue3%E7%BB%84%E6%88%90.jpg)

Vue3使用`pnpm` `workspace`实现Monorepo(pnpm是快速节省磁盘空间的包管理工具，主要采用符号连接的方式管理模块)

先pnpm init出一个package.json 然后配置一个配置文件 -> yaml（代表为配置文件的格式），指向文件夹代表包在packages

改变pnpm 的幽灵依赖形式，在根目录创建一个.npmrc 配置为shamefully-hoist=true即可

安装ts，minimist（命令行解析工具），ESbuild（开发环境打包速度快）

在packages中创建包的目录，并且每个包都有自己的配置文件package.json

```
在packag.json中

"buildOptions":{
    "name":"VueReactive",
    "formats":[
      "global",
      "cjs",
      "esm-bundler"
    ]
  }
```

ts使用其他包的文件：关联两个模块 -> 声明ts配置文件

不能直接用要先打包，创建scripts，保存打包的脚本，更改package.json的调试 node scripts/dev.js
























































































































































































