const http = require('http');
const fs = require('fs');
const path = require('path');
const svelte = require('svelte/compiler');
const sveltePreprocess = require('svelte-preprocess');

function capitalise(name) {
	return name[0].toUpperCase() + name.slice(1);
}

const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/') {

        const fileName = './src/App.svelte';
        const source = fs.readFileSync(fileName, {
            encoding: 'utf-8'
        });

        const { code } = await svelte.preprocess(source, [
            sveltePreprocess.scss(),
        ], {
            filename: fileName
        })

        const name = path.parse(fileName).name
			.replace(/^\d/, '_$&')
			.replace(/[^a-zA-Z0-9_$]/g, '');
        
        const { js, warnings } = svelte.compile(code, {
            filename: fileName,
			name: capitalise(name),
			generate: 'ssr',
			format: 'cjs'
        });

        const jsCode = js.code;
        const _module = new module.constructor();
        _module.paths = module.paths;
        const compiled = _module._compile(jsCode, fileName);
        const renderer = _module.exports.default.render({
            test: 'test'
        });
        res.end(renderer.html);
    }

    res.end();
});

server.listen(8000);