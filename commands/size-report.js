/*
Borrowed from https://gist.github.com/mracette/2e3b8585872b2f8e146e1f9734cfc474
Transformed into a console command.

Run with `node commands/size-report` to generate a size report
*/

const { execSync } = require(`child_process`)
const fs = require(`fs`)
const path = require(`path`)

const ROOT_FOLDER = path.join(__dirname, `..`)
const SOURCE_FOLDER = path.join(ROOT_FOLDER, `src`)
const BUILD_FOLDER = path.join(ROOT_FOLDER, `dist`)
const COMPRESSED_BUILD_FOLDER = ROOT_FOLDER
const COMPRESSED_BUILD_FILE_NAME = `dist.zip`
const COMPRESSED_BUILD_FILE = path.join(COMPRESSED_BUILD_FOLDER, COMPRESSED_BUILD_FILE_NAME)
const REPORT_PATH = path.join(ROOT_FOLDER, `size-report.md`)

function getFolderSize(path) {
	const stout = execSync(`ls -l ${path} | awk '{sum+=$5} END {printf sum}'`, {
		encoding: `utf8`
	})
	return getSizeFromList(stout)
}

function getFileSize(path, fileName) {
	const stout = execSync(`ls -l ${path} | grep '${fileName}' | awk '{sum+=$5} END {printf sum}'`, {
		encoding: `utf8`
	})
	return getSizeFromList(stout)
}

function getSizeFromList(stout) {
	const by = parseInt(stout)
	const kb = (by / 1024).toFixed(2)
	return [kb, by]
}

function checkExists(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path)
	}
}

let CONTENT = ``

// we will need these folders
checkExists(BUILD_FOLDER)
checkExists(COMPRESSED_BUILD_FOLDER)

// add table header
CONTENT += `| Measure | Size (kb) | Size (bytes) | Reduction |\n`
CONTENT += `| --- | --- | --- | --- |\n`

// log the size of the uncompressed source
const [kb0, bytes0] = getFolderSize(path.join(SOURCE_FOLDER, `/*`))
CONTENT += `| Raw Source Code | ${kb0} kb | ${bytes0} | NA |\n`

// perform the production build and log new size
const [kb1, bytes1] = getFolderSize(path.join(BUILD_FOLDER, `/*`))
CONTENT += `| Build | ${kb1} kb | ${bytes1} | ${
	bytes1 < bytes0 ? `-` : `+`
	}${Math.round((100 * (bytes0 - bytes1)) / bytes0)}% |\n`

// perform .zip compression and log new size
execSync(`rm -f ${COMPRESSED_BUILD_FILE}`)
execSync(`cd ${BUILD_FOLDER}; zip -r -j ${COMPRESSED_BUILD_FILE} ./*`)
const [kb2, bytes2] = getFileSize(COMPRESSED_BUILD_FOLDER, COMPRESSED_BUILD_FILE_NAME)
CONTENT += `| Compressed Build | ${kb2} kb | ${bytes2} | ${
	bytes2 < bytes1 ? `-` : `+`
	}${Math.round((100 * (bytes1 - bytes2)) / bytes1)}% |\n`

// update the log
fs.open(REPORT_PATH, `w`, (err, fd) => {
	fs.write(fd, CONTENT, null, (err) => {
		if (err) throw err
	})
})
