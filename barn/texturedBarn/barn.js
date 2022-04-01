////////////////////////////////////////////////////////////////////////////////
// Project 3:  Textured Barn
////////////////////////////////////////////////////////////////////////////////

// global parameters for barn
var params = {
    barnWidth: 20,
    barnHeight: 10,
    barnDepth: 50,
};

var guiParams = {
    mode: "showBasicBarn"
};

var barnMesh;

// create the scene, renderer, and camera

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

TW.cameraSetup(renderer, scene,
    {
        minx: 0, maxx: params.barnWidth,
        miny: 0, maxy: params.barnHeight,
        minz: -params.barnDepth, maxz: 0
    });




//adds light 
var light = new THREE.PointLight(0xffffff, 2, 0);
light.position.set(0, 0, 0);

scene.add(light);

// adds texture coordinates to all the barn vertices
function addTextureCoords(barnGeom) {
    if (!barnGeom instanceof THREE.Geometry) {
        throw "not a THREE.Geometry: " + barnGeom;
    }
    // array of face descriptors
    var UVs = [];
    function faceCoords(as, at, bs, bt, cs, ct) {
        UVs.push([new THREE.Vector2(as, at),
        new THREE.Vector2(bs, bt),
        new THREE.Vector2(cs, ct)]);
    }
    // front (faces 0-2)
    faceCoords(0, 0, 1, 0, 1, 1);
    faceCoords(0, 0, 1, 1, 0, 1);
    faceCoords(0, 1, 1, 1, 1, 0);  // upper triangle
    // back (faces 3-5)
    faceCoords(1, 0, 0, 1, 0, 0);
    faceCoords(1, 0, 1, 1, 0, 1);
    faceCoords(0, 1, 1, 1, 1, 0);  // upper triangle
    // roof (faces 6-9)
    faceCoords(1, 0, 1, 1, 0, 0);
    faceCoords(1, 1, 0, 1, 0, 0);
    faceCoords(0, 0, 1, 0, 1, 1);
    faceCoords(0, 1, 0, 0, 1, 1);
    // sides (faces 10-13)
    faceCoords(1, 0, 0, 1, 0, 0);
    faceCoords(1, 1, 0, 1, 1, 0);
    faceCoords(1, 0, 1, 1, 0, 0);
    faceCoords(1, 1, 0, 1, 0, 0);
    // floor (faces 14-15)
    faceCoords(0, 0, 1, 0, 0, 1);
    faceCoords(1, 0, 1, 1, 0, 1);

    // attach this to the geometry
    barnGeom.faceVertexUvs = [UVs];
}

// create textured barn
function displayTexture(textures) {
    var barnGeom = TW.createBarn(params.barnWidth, params.barnHeight, params.barnDepth);

    textures.wrapS = THREE.RepeatWrapping;
    textures.wrapT = THREE.MirroredRepeatWrapping;

    var barnMaterials = new THREE.MeshFaceMaterial(
        [new THREE.MeshPhongMaterial({ color: 0xff0000, map: textures[0] }), // red roof
        new THREE.MeshPhongMaterial({ color: 0xffffff, map: textures[1] }), // gray body
        ]);

    TW.setMaterialForFaces(barnGeom, 1, [0, 1, 2, 3, 4, 5]); // end faces
    TW.setMaterialForFaces(barnGeom, 0, [6, 7, 8, 9]); // roof
    TW.setMaterialForFaces(barnGeom, 1, [10, 11, 12, 13]); // sides
    TW.setMaterialForFaces(barnGeom, 1, [14, 15]); // floor

    textures.flipY = false;
    addTextureCoords(barnGeom);

    var barnMesh = new THREE.Mesh(barnGeom, barnMaterials);

    scene.add(barnMesh);
}

// multicoloredbarm
function makeMultiColoredBarn() {
    var barnGeom = TW.createBarn(params.barnWidth, params.barnHeight, params.barnDepth);

    var barnMaterials = new THREE.MeshFaceMaterial(
        [new THREE.MeshBasicMaterial({ color: 0x0000ff }), // blue ends
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // red roof
        new THREE.MeshBasicMaterial({ color: 0xffa500 }), // orange sides
        new THREE.MeshBasicMaterial({ color: 0x808080 })  // gray floor
        ]);

    TW.setMaterialForFaces(barnGeom, 0, [0, 1, 2, 3, 4, 5]); // end faces
    TW.setMaterialForFaces(barnGeom, 1, [6, 7, 8, 9]); // roof
    TW.setMaterialForFaces(barnGeom, 2, [10, 11, 12, 13]); // sides
    TW.setMaterialForFaces(barnGeom, 3, [14, 15]); // floor


    var barnMesh = new THREE.Mesh(barnGeom, barnMaterials);
    scene.add(barnMesh);
}

// makes a minimal grayscale barn and adds it to the scene
function makeBasicBarn() {
    var barnGeom = TW.createBarn(params.barnWidth, params.barnHeight, params.barnDepth);
    var barnMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    barnMesh = new THREE.Mesh(barnGeom, barnMat);
    scene.add(barnMesh);
}

// create ambient light and add to the scene
var ambLight = new THREE.AmbientLight(0x808080);
scene.add(ambLight);




// draws the scene, gets called every time the GUI changes
function redraw() {
    scene.remove(barnMesh);
    if (guiParams.mode == "showBasicBarn") {
        scene.remove(barnMesh);
        makeBasicBarn();
    }
    else if (guiParams.mode == "showTextures") {
        scene.remove(barnMesh);
        TW.loadTextures(["../textures/roof.jpeg", "../textures/brick.jpeg"],
            function (textures) {
                displayTexture(textures);
            });

    }
    else if (guiParams.mode == "showLighting") {
        scene.remove(barnMesh);
        //adds light 
        var directionalLight = new THREE.PointLight(0xffffff, 1);
        directionalLight.position.set(320, 390, 700);
        scene.add(directionalLight)
        makeBasicBarn();
    }

    else if (guiParams.mode == "showMulticoloredBarn") {
        scene.remove(barnMesh);
        makeMultiColoredBarn();
    }
    TW.render();
}
// create the GUI
var gui = new dat.GUI();
gui.add(guiParams, "mode", ["showBasicBarn", "showTextures", "showLighting", "showMulticoloredBarn"]).onChange(redraw);

// draw the scene for the first time
redraw();


