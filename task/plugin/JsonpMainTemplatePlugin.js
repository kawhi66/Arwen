/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Template = require("webpack/lib/Template");

class JsonpMainTemplatePlugin {

	apply(mainTemplate) {
		mainTemplate.plugin("local-vars", function(source, chunk) {
			if(chunk.chunks.length > 0) {
				return this.asString([
					source,
					"",
					"// objects to store loaded and loading chunks",
					"var installedChunks = {",
					this.indent(
						chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(",\n")
					),
					"};"
				]);
			}
			return source;
		});
		mainTemplate.plugin("jsonp-script", function(_, chunk, hash) {
            var jsonpFunction = this.outputOptions.jsonpFunction;
			const chunkFilename = this.outputOptions.chunkFilename;
			const chunkMaps = chunk.getChunkMaps();
			const crossOriginLoading = this.outputOptions.crossOriginLoading;
			const chunkLoadTimeout = this.outputOptions.chunkLoadTimeout;
			const jsonpScriptType = this.outputOptions.jsonpScriptType;
			const scriptSrcPath = this.applyPluginsWaterfall("asset-path", JSON.stringify(chunkFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
				chunk: {
					id: "\" + chunkId + \"",
					hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
					hashWithLength(length) {
						const shortChunkHashMap = Object.create(null);
						Object.keys(chunkMaps.hash).forEach(chunkId => {
							if(typeof chunkMaps.hash[chunkId] === "string")
								shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substr(0, length);
						});
						return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
					},
					name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`
				}
			});
			return this.asString([
				`if(typeof window !== "undefined"){`,
				"var script = document.createElement('script');",
				`script.type = ${JSON.stringify(jsonpScriptType)};`,
				"script.charset = 'utf-8';",
				"script.async = true;",
				`script.timeout = ${chunkLoadTimeout};`,
				crossOriginLoading ? `script.crossOrigin = ${JSON.stringify(crossOriginLoading)};` : "",
				`if (${this.requireFn}.nc) {`,
				this.indent(`script.setAttribute("nonce", ${this.requireFn}.nc);`),
				"}",
				`script.src = ${this.requireFn}.p + ${scriptSrcPath};`,
				`var timeout = setTimeout(onScriptComplete, ${chunkLoadTimeout});`,
				"script.onerror = script.onload = onScriptComplete;",
				"function onScriptComplete() {",
				this.indent([
					"// avoid mem leaks in IE.",
					"script.onerror = script.onload = null;",
					"clearTimeout(timeout);",
					"var chunk = installedChunks[chunkId];",
					"if(chunk !== 0) {",
					this.indent([
						"if(chunk) {",
						this.indent("chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));"),
						"}",
						"installedChunks[chunkId] = undefined;"
					]),
					"}"
				]),
				"};",
                `document.querySelector("head").appendChild(script);`,
				"}else{",
				`weex.requireModule("stream").fetch({
					url:${this.requireFn}.p + ${scriptSrcPath}
				},function(data){
					var webpackJsonp = (typeof window==="undefined"?global:window)[${JSON.stringify(jsonpFunction)}];
					eval(data.data)
				})`,
				"}",
			]);
		});
		mainTemplate.plugin("require-ensure", function(_, chunk, hash) {
			return this.asString([
				"var installedChunkData = installedChunks[chunkId];",
				"if(installedChunkData === 0) {",
				this.indent([
					"return new Promise(function(resolve) { resolve(); });"
				]),
				"}",
				"",
				"// a Promise means \"currently loading\".",
				"if(installedChunkData) {",
				this.indent([
					"return installedChunkData[2];"
				]),
				"}",
				"",
				"// setup Promise in chunk cache",
				"var promise = new Promise(function(resolve, reject) {",
				this.indent([
					"installedChunkData = installedChunks[chunkId] = [resolve, reject];"
				]),
				"});",
				"installedChunkData[2] = promise;",
				"",
				"// start chunk loading",
				this.applyPluginsWaterfall("jsonp-script", "", chunk, hash),
				"",
				"return promise;"
			]);
		});
		mainTemplate.plugin("require-extensions", function(source, chunk) {
			if(chunk.chunks.length === 0) return source;

			return this.asString([
				source,
				"",
				"// on error function for async loading",
				`${this.requireFn}.oe = function(err) { console.error(err); throw err; };`
			]);
		});
		mainTemplate.plugin("bootstrap", function(source, chunk, hash) {
			if(chunk.chunks.length > 0) {
				var jsonpFunction = this.outputOptions.jsonpFunction;
				return this.asString([
					source,
					"",
					"// install a JSONP callback for chunk loading",
					`var parentJsonpFunction = (typeof window==="undefined"?global:window)[${JSON.stringify(jsonpFunction)}];`,
					`(typeof window==="undefined"?global:window)[${JSON.stringify(jsonpFunction)}] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {`,
					this.indent([
						"// add \"moreModules\" to the modules object,",
						"// then flag all \"chunkIds\" as loaded and fire callback",
						"var moduleId, chunkId, i = 0, resolves = [], result;",
						"for(;i < chunkIds.length; i++) {",
						this.indent([
							"chunkId = chunkIds[i];",
							"if(installedChunks[chunkId]) {",
							this.indent("resolves.push(installedChunks[chunkId][0]);"),
							"}",
							"installedChunks[chunkId] = 0;"
						]),
						"}",
						"for(moduleId in moreModules) {",
						this.indent([
							"if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {",
							this.indent(this.renderAddModule(hash, chunk, "moduleId", "moreModules[moduleId]")),
							"}"
						]),
						"}",
						"if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);",
						"while(resolves.length) {",
						this.indent("resolves.shift()();"),
						"}",
						this.entryPointInChildren(chunk) ? [
							"if(executeModules) {",
							this.indent([
								"for(i=0; i < executeModules.length; i++) {",
								this.indent(`result = ${this.requireFn}(${this.requireFn}.s = executeModules[i]);`),
								"}"
							]),
							"}",
							"return result;",
						] : ""
					]),
					"};"
				]);
			}
			return source;
		});
		mainTemplate.plugin("hot-bootstrap", function(source, chunk, hash) {
			const hotUpdateChunkFilename = this.outputOptions.hotUpdateChunkFilename;
			const hotUpdateMainFilename = this.outputOptions.hotUpdateMainFilename;
			const crossOriginLoading = this.outputOptions.crossOriginLoading;
			const hotUpdateFunction = this.outputOptions.hotUpdateFunction;
			const currentHotUpdateChunkFilename = this.applyPluginsWaterfall("asset-path", JSON.stringify(hotUpdateChunkFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
				chunk: {
					id: "\" + chunkId + \""
				}
			});
			const currentHotUpdateMainFilename = this.applyPluginsWaterfall("asset-path", JSON.stringify(hotUpdateMainFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`
			});
			const runtimeSource = Template.getFunctionContent(require("webpack/lib/JsonpMainTemplate.runtime.js"))
				.replace(/\/\/\$semicolon/g, ";")
				.replace(/\$require\$/g, this.requireFn)
				.replace(/\$crossOriginLoading\$/g, crossOriginLoading ? `script.crossOrigin = ${JSON.stringify(crossOriginLoading)}` : "")
				.replace(/\$hotMainFilename\$/g, currentHotUpdateMainFilename)
				.replace(/\$hotChunkFilename\$/g, currentHotUpdateChunkFilename)
				.replace(/\$hash\$/g, JSON.stringify(hash));
			return `${source}
function hotDisposeChunk(chunkId) {
	delete installedChunks[chunkId];
}
var parentHotUpdateCallback = window[${JSON.stringify(hotUpdateFunction)}];
window[${JSON.stringify(hotUpdateFunction)}] = ${runtimeSource}`;
		});
		mainTemplate.plugin("hash", function(hash) {
			hash.update("jsonp");
			hash.update("4");
			hash.update(`${this.outputOptions.filename}`);
			hash.update(`${this.outputOptions.chunkFilename}`);
			hash.update(`${this.outputOptions.jsonpFunction}`);
			hash.update(`${this.outputOptions.hotUpdateFunction}`);
		});
	}
}
module.exports = JsonpMainTemplatePlugin;