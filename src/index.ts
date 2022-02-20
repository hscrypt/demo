let container: HTMLDivElement
container = document.createElement('div')
container.setAttribute("class", "container")

const path = window.location.pathname
const LOCALSTORAGE_KEY = `hscrypt.secret:${path}`

function setCacheDisplay() {
    const secretHex = localStorage.getItem(LOCALSTORAGE_KEY)
    const cacheDisplay = document.getElementById("cache-display")
    if (cacheDisplay) {
        cacheDisplay.innerHTML = secretHex || ''
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
    localStorage.removeItem(LOCALSTORAGE_KEY)
    setCacheDisplay()
    updateButton(true)
}

container.innerHTML = `
<div>
    <p>yayyy <i>this was injected by <a href="https://github.com/hscrypt">hscrypt</a></i></p>
    <div>
        <p>Cache:</p>
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

document.body.appendChild(container)

setCacheDisplay()
updateButton(false)
