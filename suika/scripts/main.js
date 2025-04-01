// 모듈 불러오기
import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body;

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
            Body.setPosition(currentBody, {
                x: currentBody.position.x - 10,
                y: currentBody.position.y
            })
            break;
        case "KeyD":
            Body.setPosition(currentBody, {
                x: currentBody.position.x + 10,
                y: currentBody.position.y
            })
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
addFruit();