const jog = document.getElementById("j");

const qtd_slider = document.getElementById("qtd");
const size_slider = document.getElementById("tamanho");

const opcoes = document.getElementById("opcoes");

const score = document.getElementById("score");
const melhor = document.getElementById("melhor");

const canva = document.getElementById("canva");
const width = 750;
const height = 750;
const cl = canva.offsetLeft + canva.clientLeft;
const ct = canva.offsetTop + canva.clientTop;
const ctx = canva.getContext("2d");


let qtd_elementos = 3;
let box_size = 100;
let playing = false;
var elementos = [];
var opcao = "fodase";


const sleep = (ms) => new Promise(r => setTimeout(r, ms));


let best = 0
let global_id = 1


function rn(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min
}

function draw_boxes(){
    ctx.reset();
    for (const e of elementos){
        ctx.fillRect(e[0], e[1], box_size, box_size);
    }
}

function new_box(){
    let rx, ry;
    rx = rn(0, width-box_size);
    ry = rn(0, height-box_size);

    elementos.push([rx, ry, global_id++]);
}

function show_error(x, y, rx, ry){
    ctx.fillStyle = "blue"; 
    ctx.fillRect(x-5, y-5, 10, 10);
    ctx.fillStyle = "red"; 
    ctx.fillRect(rx, ry, box_size, box_size);
}


function in_range(x, l, m){
    if (x < l) return false;
    if (x > m) return false;
    return true;
}


jog.addEventListener("click", async e => {
    ctx.reset();
    qtd_elementos = parseInt(qtd_slider.value);
    box_size = parseInt(size_slider.value)
    opcao = opcoes.options[opcoes.selectedIndex].text;
    console.log(opcao);


    jog.disabled = true;
    for (i = 0 ; i < qtd_elementos ; i++){
        new_box();
        draw_boxes();
        await sleep(200);
    }
    playing = true
});


canva.addEventListener("mousedown", e => {
    if (!playing) return;
    let cx = e.pageX - cl;
    let cy = e.pageY - ct;

    let box = elementos.shift();
    let bx = box[0];
    let by = box[1];
    let id = box[2];

    console.log(`${box_size}`)
    console.log(`${cx} ${cy}, | ${bx} ${bx+box_size} | ${by} ${by+box_size} | ${id}`);
    

    if (in_range(cx, bx, bx+box_size) && in_range(cy, by, by+box_size)){
        new_box();
        draw_boxes();
    }
    else{
        show_error(cx, cy, bx, by);
        global_id -= qtd_elementos;
        if (global_id > best) best = global_id
        melhor.innerHTML = `Melhor: ${best}`
        score.innerHTML = `Escore: ${global_id}`
        global_id = 0


        elementos = [];
        playing = false;
        jog.disabled = false;
    }

    
});