// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote
const win = remote.getCurrentWindow()
html.addEventListener('click', (e) => {
    if (e.target) {
        const element = e.target
        const id = element.id
        switch (id) {
            case 'closeButton':
                win.close()
                break;
            case 'minButton':
                win.minimize()
                break;
            case 'maxButton':
                if (win.isMax) {
                    window.resizeTo(win.mwidth, win.mheight);
                    win.setPosition(win.pos[0],win.pos[1])
                    win.isMax = false
                } else {
                    win.mwidth = window.innerWidth
                    win.mheight= window.innerHeight
                    win.pos = win.getPosition()
                    win.maximize();
                    win.isMax = true
                }
                console.log(win.isMax)
                break;
            default:
                "No event"
        }
    }
});
app.style.height = window.innerHeight - 66 + "px"
app.style.width = window.innerWidth - 44 + "px"
window.addEventListener("resize", (e) => {
    app.style.height = window.innerHeight - 66 + "px"
    app.style.width = window.innerWidth - 44 + "px"
});