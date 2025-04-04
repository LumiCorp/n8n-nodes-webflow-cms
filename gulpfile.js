const path = require('path');
const { task, src, dest, series } = require('gulp');
const fs = require('fs');

// Task: Copy icon files (existing)
function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}
task('build:icons', copyIcons);

// Task: Copy JSON files from nodes and credentials
function copyJsonFiles() {
	const nodeJsonSource = path.resolve('nodes', '**', '*.json');
	const nodeJsonDestination = path.resolve('dist', 'nodes');

	src(nodeJsonSource).pipe(dest(nodeJsonDestination));

	const credJsonSource = path.resolve('credentials', '**', '*.json');
	const credJsonDestination = path.resolve('dist', 'credentials');

	return src(credJsonSource).pipe(dest(credJsonDestination));
}
task('build:json', copyJsonFiles);

// Task: Copy additional assets (if needed)
function copyAdditionalAssets() {
	// For example, if you have HTML, CSS, or TXT files that must be preserved:
	const assetPattern = path.resolve('nodes', '**', '*.{html,css,txt}');
	const assetDestination = path.resolve('dist', 'nodes');

	return src(assetPattern).pipe(dest(assetDestination));
}
task('build:assets', copyAdditionalAssets);

// Task: Verify the build output
function verifyBuildOutput(cb) {
	// List of critical files that must be present in the final build
	const criticalFiles = [
		'dist/nodes/WebflowCms/WebflowCms.node.js',
		'dist/nodes/WebflowCms/actions/router.js',
		'dist/nodes/WebflowCms/WebflowCms.node.json'
	];

	let allFilesExist = true;

	criticalFiles.forEach(file => {
		if (!fs.existsSync(file)) {
			console.error(`CRITICAL BUILD ERROR: File not found: ${file}`);
			allFilesExist = false;
		}
	});

	if (!allFilesExist) {
		cb(new Error('Build verification failed - see missing files above'));
		return;
	}

	console.log('Build verification successful - all critical files are present.');
	cb();
}
task('verify:build', verifyBuildOutput);

// Combined task to run all build steps
task('build:all', series(
	'build:icons',
	'build:json',
	'build:assets',
	'verify:build'
));
