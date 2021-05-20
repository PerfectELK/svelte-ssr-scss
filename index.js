const http = require('http');
const fs = require('fs');
const path = require('path');
const svelte = require('svelte/compiler');
const nodeSass = require('node-sass');
const parser = require('node-html-parser');

function registerSvelteExtension() {
    function capitalise(name) {
        return name[0].toUpperCase() + name.slice(1);
    }
    require.extensions['.svelte'] = function(module, filename) {
        const name = path.parse(filename).name
            .replace(/^\d/, '_$&')
            .replace(/[^a-zA-Z0-9_$]/g, '');
    
        const options = Object.assign({}, {
            filename,
            name: capitalise(name),
            generate: 'ssr',
            format: 'cjs'
        });

        const file = fs.readFileSync(filename, 'utf-8');
        const parsed = parser.parse(file);
    
        for (const child of parsed.childNodes) {
            if (child.rawTagName === 'style' && child.getAttribute('lang') === 'scss') {
                const scss = child.innerHTML;
                const css = nodeSass.renderSync({
                    data: scss,
                }).css.toString();
                child.innerHTML = css;
                child.removeAttribute('lang');
            }
        }

        const processedFileContent = parsed.toString();
        const { js } = svelte.compile(processedFileContent, options);
        
        return module._compile(js.code, filename);
    };
}

registerSvelteExtension();

const server = http.createServer(async (req, res) => {
    const App = require('./src/svelte/App.svelte').default;
    const { html } = App.render({
        test: 'test',
    })
    res.end(html);
});
server.listen(8000);