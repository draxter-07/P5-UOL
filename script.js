const sleep = ms => new Promise(r => setTimeout(r, ms));
let tokenApi = 'Ig05OI8F18Lp90ZDISfjWMt8';
let nome_user = "";
let to = "Todos";
var input_message = document.getElementById("actual_message");
input_message.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("send_message").click();}});

function open_side(){
    document.getElementById("side").style.display = "flex";
    document.getElementById("blur").style.display = "flex";
}

function close_side(){
    document.getElementById("side").style.display = "none";
    document.getElementById("blur").style.display = "none";
}

function iniciar(){
    document.getElementById("message_login").innerHTML = "Verificando se o usuário está disponível";
    axios.defaults.headers.common['Authorization'] = tokenApi;
    let nome = {
        name: document.getElementById("name").value
    };
    let a = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", nome);
    a.then(entrar);
    function entrar(resposta){
        document.getElementById("message_login").innerHTML = "Está disponível! Bem-vindo!";
        nome_user = nome;
        open_message();
        atualizar_participantes();
        manter_conexao();
        document.getElementById("tela_inicial").style.display = "none";
        document.getElementById("tela_message").style.display = "flex";
    };
    a.catch(tentar_novamente);
    function tentar_novamente(resposta){
        document.getElementById("message_login").innerHTML = "Tente outro usuário";
    };
}

async function manter_conexao(){
    while (true){
        await sleep(5000);
        axios.defaults.headers.common['Authorization'] = tokenApi;
        let a = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", nome_user);
        a.then(conectado);
        function conectado(){
            console.log("Estou conectado");
        };
        a.catch(desconectado);
        function desconectado(){
            console.log("Não estou conectado");
        };
        atualizar_participantes();
    }
}

function send_message(){
    let message = {
        from: nome_user.name,
        to: to,
        text: document.getElementById("actual_message").value,
        type: "message"
    };
    axios.defaults.headers.common['Authorization'] = tokenApi;
    let a = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", message);
    a.then(enviado);
    function enviado(){
        console.log("Mensagem enviada");
    };
    a.catch(nao_enviado);
    function nao_enviado(){
        console.log("Mensagem não enviada");
        window.location.reload();
    };
    document.getElementById("actual_message").value = "";
}

function atualizar_participantes(){
    let b = axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    b.then(encontrado);
    function encontrado(resposta){
        console.log("Encontrei os participantes");
        document.getElementById("side_part").innerHTML = '';
        let e = document.createElement('span');
        e.innerHTML = "Escolha o destinatário";
        e.classList.add("titulo-side");
        document.getElementById("side_part").appendChild(e);
        let q = document.createElement('div');
        let v = document.createElement('div');
        let w = document.createElement('button');
        let h = document.createElement('ion-icon');
        h.name = "person-circle-outline";
        w.innerHTML = "Todos";
        w.setAttribute("onclick", "check()");
        w.classList.add("participante");
        v.appendChild(h);
        v.appendChild(w);
        v.classList.add("d1");
        q.appendChild(v);
        q.classList.add('destinatario');
        document.getElementById("side_part").appendChild(q);
        for (let i = 0; i < resposta.data.length; i++){
            let f = document.createElement('div');
            let g = document.createElement('button');
            let v = document.createElement('div');
            let h = document.createElement('ion-icon');
            g.setAttribute("onclick", "check()");
            h.name = "person-circle-outline";
            f.setAttribute("data-test", "participant");
            g.innerHTML = resposta.data[i].name;
            g.classList.add('participante');
            v.appendChild(h);
            v.appendChild(g);
            v.classList.add("d1");
            f.appendChild(v);
            f.classList.add('destinatario');
            document.getElementById("side_part").appendChild(f);
        };
    };
    b.catch(nao_encontrado);
    function nao_encontrado(){
        console.log("Não encontrei os participantes");
    };
}

async function open_message(){
    while (true){
        axios.defaults.headers.common['Authorization'] = tokenApi;
        let a = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
        a.then(recebi);
        function recebi(resposta){
            console.log("Encontrei as mensagens");
            document.getElementById('messages').innerHTML = '';
            for (let i = 0; i < resposta.data.length; i++){
                let j = resposta.data.length - i - 1;
                let f = document.createElement('div');
                let g = document.createElement('span');
                f.setAttribute("data-test", "message");
                if (resposta.data[j].type == 'status'){
                    g.innerHTML = '<span style="color:rgb(200, 200, 200)">(' + resposta.data[j].time + ')</span> <span style="color:rgb(0, 0, 0);font-weight:bold">' + resposta.data[j].from + '</span> ' + resposta.data[j].text;
                    f.classList.add('status');
                    f.appendChild(g);
                }
                else if (resposta.data[j].type == 'message'){
                    g.innerHTML = '<span style="color:rgb(200, 200, 200)">(' + resposta.data[j].time + ')</span> <span style="color:rgb(0, 0, 0);font-weight:bold">' + resposta.data[j].from + '</span> para <span style="color:rgb(0, 0, 0);font-weight:bold">' + resposta.data[j].to + '</span>: ' + resposta.data[j].text;
                    f.classList.add('message');
                    f.appendChild(g);
                };
                document.getElementById("messages").appendChild(f);
            };
        };
        a.catch(nao_recebi)
        function nao_recebi(resposta){
            console.log("Não encontrei as mensagens");
        };
        await sleep(3000);
    };
}

function check(){
    let h = event.target.closest('#destinatario');
    let ico = document.createElement('ion-icon');
    ico.name = "person-circle-outline";
    h.appendChild(ico);
}