// process 是进程
const args = require("minimist")(process.argv.slice(2))
const { build } = require("esbuild")
const { resolve } = require("path")
// args是打包的参数

// 目标的名字和构建的自定义属性
const target = args._[0] || "reactive"
const format = args.f || "global"

// 获取配置
const pkg = require(resolve(__dirname,`../packages/${target}/package.json`))

// 检测以何种方式打包
const outPutFormat = format.startsWith("global") ? 'iife' : format === "cjs" ? "cjs" : " esm"

// outfile
const outfile = resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`)

// 打包入口点
const entry = resolve(__dirname,`../packages/${target}/src/index.ts`)

// 开始构建
build({
    entryPoints:[entry],
    outfile, // 打包到什么地方
    bundle:true,
    sourcemap: true,
    format:outPutFormat, // 以何种方式打包
    globalName: pkg?.buildOptions?.name, // json中的name
    platform: format === "cjs" ? "node" : "browser", // 平台
    watch:{
        onRebuild(error){
            if(!error){
                console.log("rebuild!...")
            }
        }
    }
}).then(() => {
    console.log("watching!...");
})