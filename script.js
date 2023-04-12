const sleep = ms => new Promise(r => setTimeout(r, ms));
let tokenApi = 'Ig05OI8F18Lp90ZDISfjWMt8';
let nome_user = "";
let to = "oi";

function open_side(){
    document.getElementById("side").style.display = "flex";
    document.getElementById("blur").style.display = "flex";
}

function close_side(){
    document.getElementById("side").style.display = "none";
    document.getElementById("blur").style.display = "none";
}

function iniciar(){
    axios.defaults.headers.common['Authorization'] = tokenApi;
    let nome = {
        name: document.getElementById("name").value
    };
    let a = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", nome);
    a.then(entrar);
    function entrar(resposta){
        console.log(resposta.data);
        document.getElementById("message_login").innerHTML = "Bem-vindo!";
        nome_user = nome;
        atualizar_participantes();
        open_message();
        manter_conexao();
        document.getElementById("tela_inicial").style.display = "none";
        document.getElementById("tela_message").style.display = "flex";
    }
    a.catch(tentar_novamente);
    function tentar_novamente(resposta){
        console.log(resposta.response.status);
        document.getElementById("message_login").innerHTML = "Tente outro usuário";
    }
}

async function manter_conexao(){
    while (true){
        await sleep(5000);
        axios.defaults.headers.common['Authorization'] = tokenApi;
        let a = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", nome_user);
        a.then(conectado);
        function conectado(){
            console.log("Estou conectado");
        }
        a.catch(desconectado);
        function desconectado(){
            console.log("Não estou conectado");
        }
        atualizar_participantes();
        open_message();
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
    }
    a.catch(nao_enviado);
    function nao_enviado(){
        console.log("Mensagem não enviada");
    }
    document.getElementById("actual_message").value = "";
}

function atualizar_participantes(){
    let b = axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    b.then(encontrado);
    function encontrado(resposta){
        console.log("Encontrei os participantes");
        let st = "";
        for (let i = 0; i < resposta.data.length; i++){
            st = st + "<span>" + resposta.data[i].name + "</span><br>";
        }
        console.log("PArticipantes: " + st);
        document.getElementById("side").innerHTML = st;
    }
    b.catch(nao_encontrado);
    function nao_encontrado(){
        console.log("Não encontrei os participantes");
    }
}

function open_message(){
    axios.defaults.headers.common['Authorization'] = tokenApi;
    let a = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    a.then(recebi);
    function recebi(resposta){
        console.log("Encontrei as mensagens");
        let st = "";
        for (let i = 0; i < resposta.data.length; i++){
            st = st + "<span>" + resposta.data[i].text + "</span><br>";
        }
        console.log("Mesagnes: " + st);
        document.getElementById("messages").innerHTML = st;
    }
    a.catch(nao_recebi)
    function nao_recebi(resposta){
        console.log("Não encontrei as mensagens");
    }
}