const electronDocs = require('electron-docs')
const fs = require('fs')
const path = require('path')
const rm = require('rimraf').sync
const linter = require('electron-docs-linter');
const mkdirp = require('mkdirp').sync
const os = require('os')

const downloadPath = path.join(os.tmpdir(), 'electron-api-tmp')
const ELECTRON_COMMIT = 'cb3c5ded0f99a15edc99b61d227d135f7c3521c8'

rm(downloadPath)

module.exports = target =>
  electronDocs(target || ELECTRON_COMMIT).then(docs => {
    docs.forEach(doc => {
      const filename = path.join(downloadPath, doc.filename)
      mkdirp(path.dirname(filename))
      fs.writeFileSync(filename, doc.markdown_content)
    })
  })
  .then(() => {
    return linter(downloadPath, '9.9.9')
  })

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(0);
})
