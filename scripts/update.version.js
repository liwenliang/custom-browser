const fs = require('fs')
const path = require('path')

// 读取package.json文件
const packagePath = path.join(__dirname, '../package.json')
const packageJson = require(packagePath)

// 获取当前版本号
const currentVersion = packageJson.version

// 将版本号拆分为主版本号、次版本号和修订号
let [major, minor, patch] = currentVersion.split('.').map(Number)

// 增加修订号
patch++

// 如果修订号达到10，增加次版本号并重置修订号
if (patch >= 10) {
  minor++
  patch = 0
}

// 如果次版本号达到10，增加主版本号并重置次版本号
if (minor >= 10) {
  major++
  minor = 0
}

// 组合新的版本号
const newVersion = `${major}.${minor}.${patch}`

// 更新package.json中的版本号
packageJson.version = newVersion

// 将更新后的内容写回package.json文件
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))

console.log(`版本号已更新: ${currentVersion} -> ${newVersion}`)
