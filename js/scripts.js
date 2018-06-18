let currentRoute = "default"
let route = routes[currentRoute];
const html = document.getElementById('window')
const app = document.getElementById('app')
const main = document.querySelector('.main')
let dataId = 1;

html.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target.closest('[data-action]');
    if (!el) return
    const action = el.getAttribute("data-action");
    switch (action) {
        case 'default':
            currentRoute = "default"
            route = routes[currentRoute];
            reload();
            break;
        case 'changeRoute':
            const nroute = el.getAttribute("data-route") || "default";
            const nid = el.getAttribute("data-postid") || dataId || el.getAttribute("data-noreload");
            changeRoute(nroute, nid);
            break;
        case 'profile':
           isConnected((ls)=>changeRoute("authProfile", "nr", "GET", ls));
            break;
        case 'write':
            isConnected(()=>changeRoute("postCreate"));
            break;
        case 'sendForm':
            let datas = "form=true";
            const form = el.closest("form");
            const inputs = form.querySelectorAll("input, textarea");
            inputs.forEach(input=>{
                datas += `&${input.name}=${input.value}`;
            })
            console.log(datas);
            changeRoute(form.getAttribute("data-route"), null, "POST", datas);
            break;
        default:
            "no action"
    }
})

reload()