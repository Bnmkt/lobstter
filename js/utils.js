const ajax = (url = '', fn, method = 'GET', data = null) => {
    if (!url || !fn) return
    let req = new XMLHttpRequest();
    req.onreadystatechange = fn;
    req.open(method, url, true);
    if (method === "POST") {
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    req.send(data);
}

function timeElapsedBetweenDateAndNow(date) {
    const prevTime = new Date(date);  // Feb 1, 2011
    const thisTime = new Date();              // now
    const diff = thisTime.getTime() - prevTime.getTime();   // now - Feb 1
    return (diff);     // positive number of days
}

function dateFormat(date) {
    const seconds = Math.round(Math.abs(date / 1000));
    const mins = Math.round(seconds / 60);
    const hours = Math.round(mins / 60);
    const days = Math.round(hours / 24);
    let formatedDate = "";
    if (days > 0) {
        formatedDate += `${days} jour`
        if (days > 1) {
            if (days < 7) {
                formatedDate += "s"
            } else if (days === 7) {
                formatedDate = "Il y a une semaine"
            } else {
                const now = new Date().getTime();
                const d = new Date(date).getTime();
                const nd = new Date(now - d);
                const year = (nd.getFullYear() === new Date().getFullYear()) ? "" : nd.getFullYear();
                const month = ["janv.", "fev.", "mars", "avr.", "mai", "juin", "juil.", "aout", "sept.", "oct.", "nov.", "dec."]
                formatedDate = `${nd.getDate()} ${month[nd.getMonth()]} ${year}`
            }
        }
    } else if (hours > 0) {
        formatedDate += `${hours % 60} h`
    } else if (mins > 0) {
        formatedDate += `${mins % 60} min`
        if (mins > 1) {
            formatedDate += 's'
        }
    } else {
        formatedDate += `${seconds % 60} s`
    }
    return formatedDate.toString()
}

function getDate(date) {
    return dateFormat(timeElapsedBetweenDateAndNow(date));
}

function reload(method, data) {
    console.log(route.action, route.method, method)
    const url = `http://blogapi.seanferrara.be/api.php?a=${route.action}&r=${route.method}&id=${dataId}`;
    console.log(url)
    ajax(url, (e) => {
        if (e.target.readyState !== 4 || e.target.status !== 200) renderRouteView("load");
        const api = JSON.parse(e.target.responseText);
        const data = api.data;
        renderRouteView(currentRoute, data);
    }, method, data)
}

function changeRoute(to, id, method = "GET", data = null) {
    currentRoute = to;
    route = routes[currentRoute]
    dataId = id
    if (id === "nr") {
        renderRouteView(to, data);
    }else{
        reload(method, data)
    }
}

function getUserProp(prop) {
    let p = "";
    isConnected((ls)=>{p = ls[prop]})
    return p;
}

function isConnected(success, fail) {
    const ls = window.localStorage.getItem("user");
    if (ls) {
        success(JSON.parse(ls))
    } else {
        if(fail){
            fail()
        }else{
            changeRoute("authLogin");
        }
    }
}

function renderRouteView(currentRoute, data) {
    console.log(data)
    let htmlContent = ``;
    let html;
    switch (currentRoute) {
        case "postStore":
            html = `<div class="content">`;
            switch (data.error.code) {
                case "0":
                    changeRoute("postShow", data.error.data.id)
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                    html += `error ${data.error.code} : ${data.error.msg}`;
                    break;
            }
            html += ` <a data-action="changeRoute" data-route="postCreate" class="button">Retour</a>
</div>`
            htmlContent += html;

            break;
        case "postCreate":
            const formresp = dataId ? `<p>Ce message est une réponse</p><input type="hidden" name="responseTo" value="${dataId}">`:"";
            htmlContent = `<div class="content">
<form data-route="postStore">
${formresp}
<input type="hidden" name="title" value="Un titre pour la bdd">
<input type="hidden" name="userid" value="${getUserProp('id')}">
<label for="body">Votre message court</label>
<textarea name="body" id="body" cols="30" rows="10"></textarea>
<input type="submit" value="Envoyer" name="submit" data-action="sendForm">
</form>
</div>`
            break;
        case "authDisconnect":
            window.localStorage.clear();
            changeRoute("default");
            break;
        case "authProfile":
            htmlContent = `<div class="content">
    <p>Bonjour ${data.displayed} !</p>
    <p>Saches que pour l'instant tu ne peux rien faire ici à part te déconnecter, mais si je continue ce projet il peut y avoir plus de fonctionnalités !</p>
    <a class="button" data-action="changeRoute">Voir tous les messages</a>
    <a class="button" data-action="write" data-noreload="nr">Écrire ton message</a>
    <a class="button" data-action="changeRoute" data-route="authDisconnect" data-noreload="nr">Se déconnecter</a>
</div>`;
            break;
        case "authLogin":
            htmlContent = `<div class="content">
    <form id="form" data-route="authCreate">
        <label for="name">Nom d'utilisateur</label>
        <input type="text" required id="name" name="name">
        <label for="pass">Mot de passe</label>
        <input type="password" required id="pass" name="pass">
        <label for="pass">Confirmer mot de passe</label>
        <input type="password" id="pass2" name="pass2">
        <input type="submit" value="Envoyer" name="submit" data-action="sendForm">
    </form>
</div>`;
            break;
        case "authCreate":
            html = `<div class="content">`;
            switch (data.error.code) {
                case "0":
                    if(!data.error.data.displayedName)data.error.data.displayedName = data.error.data.name;
                    html += `Utilisateur connecté ${data.error.data.displayedName}`;
                    window.localStorage.setItem("user", JSON.stringify({
                        "id": data.error.data.id,
                        "name": data.error.data.name,
                        "displayed": data.error.data.displayedName
                    }));
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                    html += `error ${data.error.code} : ${data.error.msg}`;
                    break;
            }
            html += ` <a data-action="profile" class="button">Retour</a>
</div>`
            htmlContent += html;
            break;
        case "postShow":
            const current = data.post;
            const id = current.postId;
            const title = current.postTitle;
            const at = current.postDate;
            const content = current.postContent;
            const author = current.authName;
            const authorDisp = current.authDispName? current.authDispName: author;
            const response = (current.responseTo && current.responseTo !== "0") ? `<p class="r" data-action="changeRoute" data-route="postShow" data-postid="${current.responseTo}">En réponse à${current.respName}</p>` : '';
            let responses = ``;
            for (let r in data.response) {
                const current = data.response[r];
                const id = current.postId;
                const title = current.postTitle;
                const at = current.postDate;
                const content = current.postContent;
                const author = current.authName;
                const authorDisp = current.authDispName? current.authDispName: author;
                responses += `    <div class="post post_response" data-postid="${id}" data-action="changeRoute" data-route="postShow">
        <p class="post_authImage"><img src="./img/avatar.png" alt=""></p>
        <div>
            <div class="post_auth">
                <span class="post_username">${authorDisp}</span>@${author} - ${getDate(at)}
            </div>
            <div class="post_content">
                ${content}
            </div>
        </div>
    </div>`
            }
            htmlContent += `<div class="post_container">
<a class="button" data-action="changeRoute" data-route="postCreate" data-postid="${id}">Répondre</a>
    <div class="post" data-postid="${id}" data-action="changeRoute" data-route="postShow">
        <p class="post_authImage"><img src="./img/avatar.png" alt=""></p>
        <div>
            <div class="post_auth">
                <span class="post_username">${authorDisp}</span>@${author} - ${getDate(at)}
            </div>
            ${response}
            <div class="post_content">
                ${content}
            </div>
        </div>
    </div>
   ${responses}
</div>`
            break;
        case "load":
            htmlContent = `<div class="content">
<p>Chargement...</p>
</div>`
            break;
        default:
            if(!data)changeRoute("default")
            for (post in data.posts) {
                const current = data.posts[post];
                const id = current.postId;
                const title = current.postTitle;
                const at = current.postDate;
                const content = current.postContent;
                const author = current.authName;
                const authorDisp = current.authDispName? current.authDispName: author;
                const response = (current.responseTo && current.responseTo !== "0") ? `<p class="r" data-action="changeRoute" data-route="postShow" data-postid="${current.responseTo}">En réponse à ${current.respName}</p>` : '';
                htmlContent += `<div class="post" data-postid="${id}" data-action="changeRoute" data-route="postShow">
    <p class="post_authImage"><img src="./img/avatar.png" alt=""></p>
    <div>
        <div class="post_auth">
            <span class="post_username">${authorDisp}</span>@${author} - ${getDate(at)}
        </div>
        ${response}
        <div class="post_content">
            ${content}
        </div>
    </div>
</div>`
            }
    }
    document.querySelector(".ajax").innerHTML = htmlContent;
}

const routes = {
    "default": {request: "GET", action: "index", method: "post"},
    "postCreate": {request: "GET", action: "create", method: "post"},
    "postEdit": {request: "GET", action: "edit", method: "post"},
    "postDestroy": {request: "GET", action: "destroy", method: "post"},
    "postShow": {request: "GET", action: "show", method: "post"},
    "postStore": {request: "POST", action: "store", method: "post"},
    "postUpdate": {request: "POST", action: "update", method: "post"},
    "authLogin": {request: "GET", action: "login", method: "auth"},
    "authProfile": {request: "GET", action: "viewProfile", method: "auth"},
    "authSignin": {request: "GET", action: "signin", method: "auth"},
    "authDisconnect": {request: "GET", action: "disconnect", method: "auth"},
    "authConnect": {request: "POST", action: "connect", method: "auth"},
    "authCreate": {request: "POST", action: "create", method: "auth"},
    "commentCreate": {request: "POST", action: "create", method: "comment"},
    "commentEdit": {request: "GET", action: "edit", method: "comment"},
    "commentUpdate": {request: "POST", action: "update", method: "comment"},
    "commentDestroy": {request: "GET", action: "destroy", method: "comment"}
}