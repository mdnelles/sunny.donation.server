const fs = require('fs')
const wipeDependencies = () => {
  const file  = fs.readFileSync('./server/package.json')
  const content = JSON.parse(file)
  for (const devDep in content.devDependencies) {
    content.devDependencies[devDep] = '*'
  }
  for (const dep in content.dependencies) {
    content.dependencies[dep] = '*'
  }
  fs.writeFileSync('./server/package.json', JSON.stringify(content))
}
if (require.main === module) {
  wipeDependencies()
} else {
  module.exports = wipeDependencies
}