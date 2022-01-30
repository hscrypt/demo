let mydiv: HTMLDivElement;
mydiv = document.createElement('div');
mydiv.innerHTML = '<div>yayyy <i>this was injected by <a href="https://github.com/hscrypt">hscrypt</a></i></div>'
document.body.appendChild(mydiv)
