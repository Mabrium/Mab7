// 모듈 불러오기
import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World;

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


function addFruit() {
    
    const index = Math.floor(Math.random()*5);
    const fruits = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius,{
        index : index,
        isSleeping : true,
        render: {
            sprite: {texture: `${fruit.name}.png`}
        },
        restitution : 0.3,
    })
    currentBody = body;
    currentFruit = fruits;

    World.add(world, body);
}

addFruit();