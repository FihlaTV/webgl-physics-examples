﻿let engine;
let scene;
let canvas;
// to go quicker
let v3 = BABYLON.Vector3;

document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
},false);

let onload = function () {
    canvas = document.querySelector("#c");
    engine = new BABYLON.Engine(canvas, true);

    createScene();

    engine.runRenderLoop(function () {
        scene.render();
        scene.activeCamera.alpha += 0.01;
    });
};

let createScene = function() {

    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.OimoJSPlugin());
    scene.getPhysicsEngine().setTimeStep(1 / 10);

    //let camera = new BABYLON.ArcRotateCamera("Camera", -2.2, 1.0, 500, BABYLON.Vector3.Zero(), scene);
    let camera = new BABYLON.ArcRotateCamera("Camera", 0.86, 1.37, 250, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas);
    camera.maxZ = 5000;
    camera.lowerRadiusLimit = 120;
    camera.upperRadiusLimit = 430;
    camera.lowerBetaLimit =0.75;
    camera.upperBetaLimit =1.58 ;

    camera.attachControl(canvas);
    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0.0, -1.0, 0.5), scene);

    let mat = new BABYLON.StandardMaterial("ground", scene);
    let t = new BABYLON.Texture("../../../../assets/textures/grass.jpg", scene); // grass.jpg

    t.uScale = t.vScale = 2;
    mat.diffuseTexture = t;
    mat.specularColor = BABYLON.Color3.Black();
    let g = BABYLON.Mesh.CreateBox("ground", 400, scene);
    g.position.y = -20;
    g.scaling.y = 0.01;
    g.material = mat;
    g.physicsImpostor = new BABYLON.PhysicsImpostor(g, BABYLON.PhysicsImpostor.BoxImpostor, {
        move: false,
        mass: 0,
        friction: 1.0,
        restitution: 1.0
    }, scene);

    // Get a random number between two limits
    let randomNumber = function(min, max) {
        if (min == max) {
            return (min);
        }
        let random = Math.random();
        return ((random * (max - min)) + min);
    };

    let objects = [];
    let getPosition = function(y) {
        return new BABYLON.Vector3(randomNumber(-25, 25), randomNumber(0, 100) + y, randomNumber(-25, 25));
    };
    let max = 300;

    for ( let i = 0; i < 20; i++ ) {
        let stair = BABYLON.Mesh.CreateBox("stair", 100, scene);
        stair.position.x = i * -10;
        stair.position.y = i * 5 - 10;
        stair.scaling.x = 0.1;
        stair.scaling.y = 0.1;
        //stair.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false, mass: 0, friction: 1.0, restitution: 1.0 });
        stair.physicsImpostor = new BABYLON.PhysicsImpostor(stair, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1.0, restitution: 1.0 }, scene);
    }

    let matEraser = new BABYLON.StandardMaterial("material", scene);
    matEraser.reflectionTexture = new BABYLON.CubeTexture(
        "../../../../assets/textures/eraser_002/",
        scene,
        [
        "eraser_px.png",
        "eraser_py.png",
        "eraser_pz.png",
        "eraser_nx.png",
        "eraser_ny.png",
        "eraser_nz.png",
        ]
    );
    matEraser.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    matEraser.diffuseColor = BABYLON.Color3.Black();
    
    // Creates
    for (let i = 0; i < max; i++) {

        let scale = 1;
        let s = BABYLON.Mesh.CreateBox("s", 15, scene);
        // 消しゴムのサイズとなるよう調整
        s.scaling.x = 1.0;
        s.scaling.y = 0.2;
        s.scaling.z = 0.5;
        s.position = new v3(randomNumber(-25,25) - 120, randomNumber(0, 100) + 200, randomNumber(-50, 50));
        s.material = matEraser;
        //s.setPhysicsState({impostor:BABYLON.PhysicsEngine.BoxImpostor, mass:1, friction:0.4, restitution:0.2});
        s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.4, restitution: 0.2 }, scene);

        // SAVE OBJECT
        objects.push(s);

        // INCREMENT HEIGHT
        //y+=10;
    }

    scene.registerBeforeRender(function() {
        objects.forEach(function(obj) {
            if (obj.position.y < -100) {
                obj.position = getPosition(200);
                obj.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0));
            }
        });
    });
/*    
*/
};
