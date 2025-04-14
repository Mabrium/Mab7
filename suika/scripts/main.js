// 모듈 불러오기
import { FRUITS } from "./fruits.js";

const loadTexture = async () => {

    const textureList = [
    'image/00_cherry.png',
    'image/01_strawberry.png',
    'image/02_grape.png',
    'image/03_gyool.png',
    'image/04_orange.png',
    'image/05_apple.png',
    'image/06_pear.png',
    'image/07_peach.png',
    'image/08_pineapple.png',
    'image/09_melon.png',
    'image/10_watermelon.png',
    ]
    
    const load = textureUrl => {
    const reader = new FileReader()
    
    return new Promise( resolve => {
    reader.onloadend = ev => {
    resolve(ev.target.result)
    }
    fetch(textureUrl).then( res => {
    res.blob().then( blob => {
    reader.readAsDataURL(blob)
    })
    })
    })
    }
    
    const ret = {}
    
    for ( let i = 0; i < textureList.length; i++ ) {
    ret[textureList[i]] = await load(`${textureList[i]}`)
    }
    
    return ret
    }
    
    const textureMap = await loadTexture()
    
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events;

//엔진 선언
const engine = Engine.create();
//렌더 선언
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: '#F7F4C8',
        width: 620,
        height: 850,
    }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, 
    render: { fillStyle: '#E6B143'}
})
const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true, 
    render: { fillStyle: '#E6B143'}
})
const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true, 
    render: { fillStyle: '#E6B143'}
})
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    name : "topLine",
    isStatic: true, 
    isSensor: true,
    render: { fillStyle: '#E6B143'}
})


World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

let disableAction = false;

let interval = null;

function addFruit() {
    
    const index = Math.floor(Math.random()*5);
    const fruits = FRUITS[index];

    const body = Bodies.circle(300, 50, fruits.radius,
    {
        index : index,
        isSleeping : true,
        render: {
            sprite: {texture: `${fruits.name}.png`}
        },
        restitution : 0.3,
    })
    currentBody = body;
    currentFruit = fruits;

    World.add(world, body);
}
window.onkeydown = (event) => {
    if(disableAction)
        return;
    switch(event.code){
        case "KeyA":
            if(interval)
                return;
            interval = setInterval(() => {
                if(currentBody.position.x - currentFruit.radius > 30){
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x - 1,
                        y: currentBody.position.y
                    })
                }
            }, 5)
            break;
        case "KeyD":
            if(interval)
                return;
            interval = setInterval(() => {
                if(currentBody.position.x + currentFruit.radius < 590){
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x + 1,
                        y: currentBody.position.y
                    })
                }
            }, 5)
            break;
        case "Enter":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(()=> {
                addFruit();
                disableAction = false;
            }, 1000);
            break;
    }
}

window.onkeyup = (event) => {
    switch(event.code) {
        case "KeyA":
        case "KeyD":
            clearInterval(interval);
            interval = null
    }
}
Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if(collision.bodyA.index == collision.bodyB.index){
            const index = collision.bodyA.index;

            World.remove(world, [collision.bodyA, collision.bodyB]);
            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    index : index + 1,
                    render : {sprite: {texture: `${newFruit.name}.png`}
                    }
                }
            )
            World.add(world, newBody);

            if(newBody.index === 10){
                alert("SIUUUUUBAK");
                disableAction = true;
            }
        }
        if(!disableAction && (collision.bodyA.name == "topLine" || collision.bodyB.name == "topLine")){
            alert("GameOver");
        }
    })
})
addFruit();