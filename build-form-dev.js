#!/usr/bin/env node

/**
 * Build script for Bizuit Custom Forms - DEV MODE
 * Creates a FAT BUNDLE with all dependencies included for dev.html testing
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const config = {
  entryPoint: process.argv[2] || './src/index.tsx',
  outfile: process.argv[3] || './dist/form.dev.js',
  formName: process.argv[4] || 'custom-form',
};

console.log('🔨 Building Bizuit Custom Form (DEV - Fat Bundle)...');
console.log(`📄 Entry: ${config.entryPoint}`);
console.log(`📦 Output: ${config.outfile}`);

async function buildForm() {
  try {
    const distDir = path.dirname(config.outfile);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    const globalReactPlugin = {
      name: 'global-react',
      setup(build) {
        build.onResolve({ filter: /^react$/ }, args => ({ path: args.path, namespace: 'global-react' }))
        build.onResolve({ filter: /^react-dom$/ }, args => ({ path: args.path, namespace: 'global-react' }))
        build.onResolve({ filter: /^react\/jsx-runtime$/ }, args => ({ path: args.path, namespace: 'global-react' }))

        build.onLoad({ filter: /.*/, namespace: 'global-react' }, args => ({
          contents: args.path === 'react' ? 'module.exports = window.React'
            : args.path === 'react-dom' ? 'module.exports = window.ReactDOM'
            : 'module.exports = { jsx: window.React.createElement, jsxs: window.React.createElement, Fragment: window.React.Fragment }',
          loader: 'js',
        }))
      },
    }

    await esbuild.build({
      entryPoints: [config.entryPoint],
      bundle: true,
      format: 'esm',
      outfile: config.outfile,
      platform: 'browser',
      target: ['es2020'],
      minify: false,
      sourcemap: true,
      plugins: [globalReactPlugin],
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      logLevel: 'info',
    });

    const stats = fs.statSync(config.outfile);
    console.log(`✅ Build successful! Size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Copy dev-credentials.js to dist/ if it exists
    const formDir = path.dirname(config.entryPoint); // Get form directory (where src/ is)
    const devCredsSrc = path.join(formDir, '..', 'dev-credentials.js'); // Up one level from src/
    const devCredsDest = path.join(distDir, 'dev-credentials.js');

    if (fs.existsSync(devCredsSrc)) {
      fs.copyFileSync(devCredsSrc, devCredsDest);
      console.log('📋 Copied dev-credentials.js to dist/');
    } else {
      // Copy example file if dev-credentials.js doesn't exist
      const exampleSrc = path.join(formDir, '..', 'dev-credentials.example.js');
      if (fs.existsSync(exampleSrc)) {
        fs.copyFileSync(exampleSrc, devCredsDest);
        console.log('📋 Copied dev-credentials.example.js to dist/dev-credentials.js');
        console.log('⚠️  Edit dist/dev-credentials.js with your actual credentials');
      }
    }

    // Copy dev.html to dist/
    const devHtmlSrc = path.join(formDir, '..', 'dev.html');
    const devHtmlDest = path.join(distDir, 'dev.html');
    if (fs.existsSync(devHtmlSrc)) {
      fs.copyFileSync(devHtmlSrc, devHtmlDest);
      console.log('📋 Copied dev.html to dist/');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForm();
