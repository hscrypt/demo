import { escapeRegExp } from 'lodash'
import { SyncHook } from 'tapable'
import { Compiler } from 'webpack'
import HTMLWebpackPlugin = require("html-webpack-plugin")

export function is(filenameExtension: string) {
    const reg = new RegExp(`\.${filenameExtension}$`)
    return (fileName: string) => reg.test(fileName)
}

export const isCSS = is('css')

interface BeforeAssetTagGenerationData {
    outputName: string
    assets: {
        publicPath: string
        css: string[]
    }
    plugin: HTMLWebpackPlugin
}

interface BeforeEmitData {
    html: string
    outputName: string
    plugin: HTMLWebpackPlugin
}

interface HTMLWebpackPluginHooks {
    beforeAssetTagGeneration: SyncHook<BeforeAssetTagGenerationData>
    beforeEmit: SyncHook<BeforeEmitData>
}

type CSSStyle = string

export interface ReplaceConfig {
    position?: 'before' | 'after'
    removeTarget?: boolean
    target: string
}

export type StyleTagFactory = (params: { style: string }) => string

export const DEFAULT_REPLACE_CONFIG: ReplaceConfig = {
    target: '</head>',
}

export interface Config {
    filter?(fileName: string): boolean
    leaveCSSFile?: boolean
    replace?: ReplaceConfig
    styleTagFactory?: StyleTagFactory
}

export interface FileCache {
    [fileName: string]: string // file content
}

interface Asset {
    source(): string
    size(): number
}

interface Compilation {
    assets: { [key: string]: Asset }
}

export class HscryptPlugin {
    // Using object reference to distinguish styles for multiple files
    private cssStyleMap: Map<HTMLWebpackPlugin, CSSStyle[]> = new Map()
    protected cssStyleCache: FileCache = {}

    constructor(protected readonly config: Config = {}) {}

    protected get replaceConfig() {
        return this.config.replace || DEFAULT_REPLACE_CONFIG
    }

    protected get styleTagFactory(): StyleTagFactory {
        return (
            this.config.styleTagFactory ||
            (({ style }) => `<style type="text/css">${style}</style>`)
        )
    }

    protected prepare({ assets }: Compilation) {
        Object.keys(assets).forEach((fileName) => {
            if (isCSS(fileName) && this.isCurrentFileNeedsToBeInlined(fileName)) {
                this.cssStyleCache[fileName] = assets[fileName].source()

                if (!this.config.leaveCSSFile) {
                    delete assets[fileName]
                }
            }
        })
    }

    protected getCSSStyle(
        {
            cssLink,
            publicPath,
        }: {
            cssLink: string
            publicPath: string
        }
    ): string | undefined {
        // Link pattern: publicPath + fileName + '?' + hash
        const fileName = cssLink
            .replace(new RegExp(`^${escapeRegExp(publicPath)}`), '')
            .replace(/\?.+$/g, '')

        if (this.isCurrentFileNeedsToBeInlined(fileName)) {
            const style = this.cssStyleCache[fileName]

            if (style === undefined) {
                console.error(
                    `Can not get css style for ${cssLink}. It may be a bug of html-inline-css-webpack-plugin.`,
                )
            }

            return style
        } else {
            return undefined
        }
    }

    protected isCurrentFileNeedsToBeInlined(fileName: string): boolean {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName)
        } else {
            return true
        }
    }

    protected addStyle(
        {
            html,
            htmlFileName,
            style,
        }: {
            html: string
            htmlFileName: string
            style: string
        }
    ) {
        const replaceValues = [
            this.styleTagFactory({ style }),
            this.replaceConfig.target,
        ]

        if (this.replaceConfig.position === 'after') {
            replaceValues.reverse()
        }

        if (html.indexOf(this.replaceConfig.target) === -1) {
            throw new Error(
                `Can not inject css style into "${htmlFileName}", as there is not replace target "${this.replaceConfig.target}"`,
            )
        }

        return html.replace(this.replaceConfig.target, replaceValues.join(''))
    }

    private prepareCSSStyle(data: BeforeAssetTagGenerationData) {
        // `prepareCSSStyle` may be called more than once in webpack watch mode.
        // https://github.com/Runjuu/html-inline-css-webpack-plugin/issues/30
        // https://github.com/Runjuu/html-inline-css-webpack-plugin/issues/13
        this.cssStyleMap.clear()

        const [...cssAssets] = data.assets.css
        cssAssets.forEach((cssLink) => {
            if (this.isCurrentFileNeedsToBeInlined(cssLink)) {
                const style = this.getCSSStyle({
                    cssLink,
                    publicPath: data.assets.publicPath,
                })

                if (style) {
                    if (this.cssStyleMap.has(data.plugin)) {
                        this.cssStyleMap.get(data.plugin)!.push(style)
                    } else {
                        this.cssStyleMap.set(data.plugin, [style])
                    }
                    const cssLinkIndex = data.assets.css.indexOf(cssLink)
                    // prevent generate <link /> tag
                    if (cssLinkIndex !== -1) {
                        data.assets.css.splice(cssLinkIndex, 1)
                    }
                }
            }
        })
    }

    protected cleanUp(html: string) {
        return this.replaceConfig.removeTarget
            ? html.replace(this.replaceConfig.target, '')
            : html
    }

    private process(data: BeforeEmitData) {
        // check if current html needs to be inlined
        if (this.isCurrentFileNeedsToBeInlined(data.outputName)) {
            const cssStyles = this.cssStyleMap.get(data.plugin) || []

            cssStyles.forEach((style) => {
                data.html = this.addStyle({
                    style,
                    html: data.html,
                    htmlFileName: data.outputName,
                })
            })

            data.html = this.cleanUp(data.html)
        }
    }

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap(
            `hscrypt_compilation`,
            (compilation) => {
                const hooks: HTMLWebpackPluginHooks = (HTMLWebpackPlugin as any).getHooks(
                    compilation,
                )

                hooks.beforeAssetTagGeneration.tap(
                    `hscrypt_beforeAssetTagGeneration`,
                    (data) => {
                        this.prepare(compilation)
                        this.prepareCSSStyle(data)
                    },
                )

                hooks.beforeEmit.tap(`hscrypt_beforeEmit`, (data) => {
                    this.process(data)
                })
            },
        )
    }
}
