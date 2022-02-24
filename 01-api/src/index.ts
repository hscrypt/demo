const hscrypt = require("hscrypt")

const container: HTMLDivElement = document.getElementById("container") as any

function setCacheDisplay() {
    const decryptionKeyHex = hscrypt.getCachedDecryptionKey()
    const cacheDisplay = document.getElementById("cache-display")
    if (cacheDisplay) {
        cacheDisplay.innerHTML = decryptionKeyHex || '&nbsp;'
    }
}

function updateButton(disabled: boolean) {
    const clearCacheBtn = document.getElementById("clear-cache")
    if (clearCacheBtn) {
        if (disabled) {
            clearCacheBtn.setAttribute('disabled', 'true')
        } else {
            clearCacheBtn.removeAttribute('disabled')
        }
    }
}

export function clearCache() {
    hscrypt.clearCachedDecryptionKey()
    setCacheDisplay()
    updateButton(true)
}

container.innerHTML = `
<div>
    <p>yayyy <i>this was injected by <a href="https://github.com/hscrypt">hscrypt</a></i></p>
    <div>
        <p>Cached decryption key:</p>
        <pre id="cache-display"></pre>
    </div>
    <p>
        <input 
            id="clear-cache" 
            type="button" 
            value="Clear cache" 
            onClick="MyApp.clearCache()" 
        />
        <input
            id="refresh-page"
            type="button"
            value="Refresh page"
            onclick="location.reload()"
        />
    </p>
</div>
`

setCacheDisplay()
updateButton(false)
