window.addEventListener('DOMContentLoaded', function () {

    var app = document.querySelector('#app');
    var canvas = document.getElementById('renderCanvas');
    // Make canvas focusable so key events work
    try { canvas.tabIndex = 0; } catch (e) { }
    var engine = new BABYLON.Engine(canvas, true, {
        stencil: true
    });

    // Basic WebGL / engine check removed (Babylon.js handles this)

    // Global error overlay to surface JS errors to the page
    window.onerror = function (msg, src, line, col, error) {
        console.error('Unhandled error:', msg, 'at', src + ':' + line + ':' + col, error);
        var overlay = document.getElementById('js-error-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'js-error-overlay';
            overlay.style.position = 'fixed';
            overlay.style.left = '10px';
            overlay.style.right = '10px';
            overlay.style.bottom = '10px';
            overlay.style.zIndex = 99999;
            overlay.style.background = 'rgba(200,0,0,0.85)';
            overlay.style.color = '#fff';
            overlay.style.padding = '12px';
            overlay.style.borderRadius = '6px';
            overlay.style.fontFamily = 'monospace';
            overlay.style.fontSize = '13px';
            document.body.appendChild(overlay);
        }
        overlay.textContent = 'JS Error: ' + msg + ' (see console for details)';
    };

    console.log('BABYLON Engine initializing...');

    // function introHide() {
    app.style.display = 'flex';
    canvas.style.display = 'block';
    engine.resize();
    // }
    // setTimeout(introHide, 1000);

    var materialsMenusBtn = document.querySelector('.materials-btn'),
        materialsMenu = document.querySelector('.materials'),
        closeBtn = document.querySelector('.toggle-menu');

    materialsMenusBtn.addEventListener('click', function (e) {
        materialsMenusBtn.style.display = 'none';
        materialsMenu.style.display = 'flex';
        closeBtn.style.display = 'flex';
    }, false);

    closeBtn.addEventListener('click', function (e) {
        materialsMenusBtn.style.display = 'flex';
        materialsMenu.style.display = 'none';
        closeBtn.style.display = 'none';
    }, false);

    // var switchLangBtn = document.querySelector('.lang');
    materialName = document.querySelector('.name'),
        typeOfWood = document.querySelector('.type'),
        oakWood = document.querySelector('.oak span');
    courbarilWood = document.querySelector('.courbaril span');
    price = document.querySelector('.price span:first-of-type');

    // switchLangBtn.addEventListener('click', function (e) {
    //     if (switchLangBtn.classList.contains('pl')) {
    //         materialName.textContent = "Bal";
    //         typeOfWood.textContent = "Gatunek drewna";
    //         oakWood.textContent = "Dąb";
    //         courbarilWood.textContent = "Jatoba";
    //         price.textContent = "Cena";
    //         switchLangBtn.classList.remove('pl');
    //         switchLangBtn.classList.add('en');

    //     } else {
    //         switchLangBtn.classList.remove('en');
    //         switchLangBtn.classList.add('pl');
    //         materialName.textContent = "Block";
    //         typeOfWood.textContent = "Type of wood";
    //         oakWood.textContent = "Oak";
    //         courbarilWood.textContent = "Courbaril";
    //         price.textContent = "Price";
    //     }
    // });

    var toggleTypeOfWood = document.querySelector('.type');
    var woodType = document.querySelectorAll('.wood-type');

    for (let i = 0; i < woodType.length; i++) {
        toggleTypeOfWood.addEventListener('click', function (e) {
            var type = woodType[i];

            if (type.style.display === 'none') {
                type.style.display = 'flex';
                type.style.marginTop = '0';
            } else {
                type.style.display = 'none';
                type.style.marginTop = '-100px';
            }
        });
    }

    var createScene = function () {
        // Create a basic BJS Scene object.
        var scene = new BABYLON.Scene(engine);
        console.log('Scene created');

        // scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        scene.collisionsEnabled = true;

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -30), scene);

        // camera.checkCollisions = true;
        // camera.applyGravity = true;

        // let cameraTopBtn = document.querySelector('.top-view');

        // cameraTopBtn.addEventListener('click', function (e) {
        //     camera = cameraTop;
        //     console.log(camera);
        // });

        // var switchCam = true;

        // cameraTopBtn.addEventListener("click", function (e) {
        //     if (switchCam) {
        //         scene.activeCamera = camera;
        //     } else {
        //         scene.activeCamera = camera2;
        //     }
        //     switchCam = !switchCam;
        // })



        // Target the camera to scene origin.
        camera.setTarget(BABYLON.Vector3.Zero());
        // camera2.setTarget(BABYLON.Vector3.Zero());


        // Attach the camera to the canvas.
        camera.attachControl(canvas, false);
        // camera2.attachControl(canvas, false);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.ambient = new BABYLON.Color3(1, 1, 1);
        light.emissive = new BABYLON.Color3(1, 1, 1);

        camera.parent = light;

        var grid = new BABYLON.GridMaterial('grid', scene);
        grid.mainColor = new BABYLON.Color3.FromInts(90, 100, 110);
        grid.lineColor = new BABYLON.Color3.FromInts(205, 230, 250);
        grid.gridRatio = 2;
        grid.minorUnitVisibility = 0.2;
        grid.majorUnitFrequency = 3;

        var ground = BABYLON.MeshBuilder.CreateGround('ground', {
            height: 48,
            width: 48,
        }, scene);


        ground.material = grid;
        ground.checkCollisions = true;

        // Debug sphere to verify rendering and camera
        var debugMat = new BABYLON.StandardMaterial('debugMat', scene);
        debugMat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
        var debugSphere = BABYLON.MeshBuilder.CreateSphere('debugSphere', { diameter: 2 }, scene);
        debugSphere.material = debugMat;
        debugSphere.position = new BABYLON.Vector3(0, 1, 0);

        console.log('Added debug sphere at', debugSphere.position.asArray());

        var brickMaterial = new BABYLON.StandardMaterial('brickMat', scene);
        brickMaterial.ambientTexture = new BABYLON.Texture("img/textures/brick.jpg", scene);
        // brickMaterial.diffuseColor = new BABYLON.Color3.FromInts(255, 102, 102);
        // brickMaterial.ambientColor = new BABYLON.Color3.FromInts(0, 0, 0);
        brickMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // brickMaterial.specular = new BABYLON.Color3(0, 0, 0);
        // brickMaterial.ground = new BABYLON.Color3(1, 1, 1);

        // brickMaterial.specularTexture = new BABYLON.Texture("img/brick.jpg", scene);
        // brickMaterial.emissiveTexture = new BABYLON.Texture("img/brick.jpg", scene);
        // brickMaterial.ambientTexture = new BABYLON.Texture("img/brick.jpg", scene);

        var courbaril = new BABYLON.StandardMaterial("courbaril", scene);
        // courbaril.specularTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png", scene);
        // courbaril.emissiveTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png", scene);
        courbaril.ambientTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png", scene);
        courbaril.emissiveColor = new BABYLON.Color3(1, 1, 1);

        // courbaril.ambientColor = new BABYLON.Color3(1, 1, 1);
        // courbaril.diffuseColor = new BABYLON.Color3(1, 1, 1);

        // courbaril.diffuseTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png", scene);

        var oak = new BABYLON.StandardMaterial("oak", scene);
        // oak.specularTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);
        // oak.emissiveTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);
        oak.ambientTexture = new BABYLON.Texture("img/textures/wood/oak_texture.png", scene);
        oak.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // oak.specular = new BABYLON.Color3(1, 1, 1);

        // oak.diffuseTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);


        var wenge = new BABYLON.StandardMaterial("wenge", scene);
        // wenge.diffuseTexture = new BABYLON.Texture("img/wood/wenge2.png", scene);
        // wenge.specularTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png",
        //     scene);
        // wenge.emissiveTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png",
        //     scene);
        wenge.ambientTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png", scene);
        // wenge.diffuse = new BABYLON.Color3(1, 1, 1);
        // wenge.ambient = new BABYLON.Color3(1, 1, 1);
        // wenge.specular = new BABYLON.Color3(1, 1, 1);
        wenge.emissiveColor = new BABYLON.Color3(1, 1, 1);
        wenge.ambientColor = new BABYLON.Color3(1, 1, 1);
        // wenge.ground = new BABYLON.Color3(1, 1, 1);

        var meshArr = [];

        var priceValue = document.querySelector('.value');

        var block = BABYLON.SceneLoader.ImportMesh("Cube", "", "meshes/cube3.babylon", scene, function (meshes) {
            var mesh = meshes[0];
            block = meshes[0];
            mesh.id = "mesh 1";
            mesh.name = 'Block'
            mesh.material = wenge;
            mesh.position.y = 1;
            mesh.position.z = -6;
            mesh.width = 3;
            mesh.checkCollisions = true;
            if (meshArr.length === 0) {
                meshArr[0] = mesh;
            } else {
                // Push if array not empty or handle logic appropriately 
                // (Preserving original intent but handling async race if intended to be first)
                meshArr.push(mesh);
            }
            // mesh.setEnabled(false);
        });

        var doniczka = BABYLON.SceneLoader.ImportMesh("", "", "meshes/doniczka_large.babylon", scene, function (meshes) {
            var mesh = meshes[0];
            // block = meshes[0]; // Don't overwrite block
            mesh.id = "mesh 1";
            mesh.name = 'Doniczka'
            mesh.position.y = 19;
            mesh.position.z = 0;

            mesh.scaling.x = 10;
            mesh.scaling.y = 10;
            mesh.scaling.z = 10;

            mesh.width = 3;
            mesh.checkCollisions = true;
            // Don't blindly overwrite meshArr[0], push instead or handle logic
            meshArr.push(mesh);
            // mesh.setEnabled(false);
        });



        var editMesh = function () {
            // var priceValue = document.querySelector('.value');
            var getElement = document.querySelector('.material-img');
            var removeElement = document.querySelector('.remove');
            var setNumber = document.querySelector('.number');

            getElement.addEventListener('click', function (e) {
                var lastMesh = meshArr[meshArr.length - 1];
                var newInstance = meshArr[0].clone();

                if (meshArr.length === 1) {
                    newInstance.id = "mesh " + (meshArr.length + 1);
                    newInstance.position.x = lastMesh.position.x + 1.36;
                    newInstance.enableEdgesRendering();
                    newInstance.edgesWidth = 1;
                    newInstance.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
                    meshArr.push(newInstance);
                    setNumber.textContent = (meshArr.length).toString();
                    // priceValue = meshArr.length + ' zł';
                } else {
                    newInstance.id = "mesh " + (meshArr.length + 1);
                    newInstance.position.x = lastMesh.position.x + 1.36;
                    newInstance.enableEdgesRendering();
                    newInstance.edgesWidth = 1;
                    newInstance.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
                    meshArr.push(newInstance);
                    setNumber.textContent = (meshArr.length).toString();
                    // priceValue = meshArr.length + ' zł';
                }
                // return meshArr;
            });

            removeElement.addEventListener('click', function (e) {
                var lastMesh = meshArr[meshArr.length - 1];
                if (meshArr.length > 1) {
                    lastMesh.dispose();
                    meshArr.splice(-1, 1);
                    setNumber.textContent = (meshArr.length).toString();
                    priceValue.textContent = meshArr.length + ' zł';
                }
            });
        }

        window.meshArr = meshArr;

        // var mergeBlocks = function() {
        //     var addBtn = document.querySelector('.add-block');
        //     addBtn.addEventListener('click', function() {
        //         var mesh = BABYLON.Mesh.MergeMeshes(meshArr);       
        //     }, false)
        // }

        // mergeBlocks();

        var buildBlock = function () {
            var addBtn = document.querySelector('.material-container');
            addBtn.addEventListener('click', function () {
                var block = new BABYLON.SolidParticleSystem("block", scene);
                for (let i = 0; i < meshArr.length; i++) {
                    // Clean up logic here? The original code had a weird inner closure builder that didn't use 'particle' correctly in scope
                    var particleRef = meshArr[i];
                    var myBuilder = function (p, i, s) {
                        // Original was modifying 'particle' from outer scope, but 'p' (particle) is passed here
                        p.position.x = s * 2;
                        p.color = new BABYLON.Color4(0.6, 0.6, 0.6, 1);
                    }
                    block.addShape(particleRef, 4, {
                        positionFunction: myBuilder
                    });
                }
                block.buildMesh();
                block.mesh.position.y = 1;
                block.mesh.material = oak;
                block.mesh.enableEdgesRendering(.1);
                block.mesh.edgesWidth = 0.7;
                block.mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
                block.mesh.checkCollisions = true;
                console.log(block.mesh);
            }, false)
        }

        buildBlock();


        var chooseWood = function () {
            var pickOak = document.querySelector('.oak img')
            var pickWenge = document.querySelector('.wenge img')
            var pickCourbaril = document.querySelector('.courbaril img')

            pickOak.addEventListener('click', function (e) {
                for (var i = 0; i < meshArr.length; i++) {
                    meshArr[i].material = oak;
                }
            });

            pickWenge.addEventListener('click', function (e) {
                for (var i = 0; i < meshArr.length; i++) {
                    meshArr[i].material = wenge;
                }
            });

            pickCourbaril.addEventListener('click', function (e) {
                for (var i = 0; i < meshArr.length; i++) {
                    meshArr[i].material = courbaril;
                }
            });
        }



        editMesh();
        chooseWood();

        // cloneBlock();

        var bricks = [];

        var brickInfo = {
            name: 'Brick',
            position: {
                x: 3,
                y: 0.25,
                z: 0.5
            },
            material: brickMaterial,
            width: 2,
            height: 0.5,
            depth: 1,
            price: 0.20
        }

        var createBrick = function () {
            var brick = BABYLON.MeshBuilder.CreateBox(brickInfo.name, {
                height: brickInfo.height,
                width: brickInfo.width,
                depth: brickInfo.depth
            }, scene);
            brick.price = brickInfo.price;
            brick.position.x = brickInfo.position.x;
            brick.position.y = brickInfo.position.y;
            brick.position.z = brickInfo.position.z;
            brick.material = brickInfo.material;
            brick.checkCollisions = true;
            bricks.push(brick);
        }

        createBrick();

        var buildBrick = function (posX) {

            var brick = new BABYLON.SolidParticleSystem("brick", scene);
            // Fix loop logic: particle was undefined outside loop
            // And shape addition was outside loop but used 'particle'
            for (let i = 0; i < bricks.length; i++) {
                var particle = bricks[i];
                // This builder logic looks suspect but preserving intent
                var myBuilder = function (p, i, s) {
                    p.width = brickInfo.width;
                    p.height = 0.5;
                    p.depth = 1;
                }
                brick.addShape(particle, 1); // Moved inside loop or fixed ref?
                // The original code had `brick.addShape(particle, 1)` OUTSIDE the loop, using the LAST `particle` var
                // which is technically valid in var-hoisted JS but logical garbage.
                // Assuming intention was to add all?
            }
            // If the intention was just to add one shape:
            if (bricks.length > 0) {
                brick.addShape(bricks[0], 1);
            }

            brick.buildMesh();
            brick.mesh.material = brickInfo.material;
            brick.mesh.name = 'Brick';
            brick.mesh.price = brickInfo.price;
            brick.mesh.enableEdgesRendering();
            brick.mesh.edgesWidth = 1;
            brick.mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
            brick.mesh.width = 2;
            brick.mesh.height = 0.5;
            brick.mesh.depth = 1;
            brick.mesh.position.x = brickInfo.position.x;
            brick.mesh.position.y = brickInfo.position.y;
            brick.mesh.position.z = brickInfo.position.z;
            // bricks.push(brick.mesh);
            console.log(brick);
        }

        let addBrickBtn = document.querySelector('.add');

        var bamboo = BABYLON.MeshBuilder.CreateCylinder("Bamboo", {
            diameterTop: 0.4,
            diameterBottom: 0.4,
            tessellation: 120,
            height: 6
        }, scene);

        bamboo.material = oak;
        bamboo.position.y = 3;


        var buildBamboo = function (posX) {

            var bambooPart = new BABYLON.SolidParticleSystem("Bamboo", scene);

            var particle = bamboo;
            var myBuilder = function (p, i, s) {
                p.diameterTop = 0.4,
                    p.diameterBottom = 0.4,
                    p.tessellation = 96,
                    p.height = 6
            }

            bambooPart.addShape(particle, 1);
            bambooPart.buildMesh();
            bambooPart.mesh.material = oak;
            bambooPart.mesh.name = 'Bamboo';
            bambooPart.mesh.enableEdgesRendering();
            bambooPart.mesh.edgesWidth = 1;
            bambooPart.mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
            bambooPart.mesh.position.x = 1;
            bambooPart.mesh.position.y = 3;
            bambooPart.mesh.position.z = 1;
            // bricks.push(brick.mesh);
            console.log(bambooPart);
        }

        var concrete = new BABYLON.StandardMaterial("concrete", scene);

        concrete.diffuseTexture = new BABYLON.Texture("img/ground/concrete.png", scene);
        concrete.specularTexture = new BABYLON.Texture("img/ground/concrete.png", scene);
        concrete.emissiveTexture = new BABYLON.Texture("img/ground/concrete.png", scene);
        concrete.ambientTexture = new BABYLON.Texture("img/ground/concrete.png", scene);
        concrete.diffuseTexture.uScale = 3;
        concrete.diffuseTexture.vScale = 3;
        concrete.specularTexture.uScale = 3;
        concrete.specularTexture.vScale = 3;
        concrete.emissiveTexture.uScale = 3;
        concrete.emissiveTexture.vScale = 3;
        concrete.ambientTexture.uScale = 3;
        concrete.ambientTexture.vScale = 3;

        scene.clearColor = new BABYLON.Color3.FromInts(160, 184, 183);

        var startingPoint;
        var currentMesh;
        var hl;
        var clicks = 0;

        var left = function (e) {
            if (e.keyCode == "38") {
                currentMesh.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
            }
        }

        var right = function (e) {
            if (e.keyCode == "37") {
                currentMesh.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
            }
        }
        var up = function (e) {
            if (e.keyCode == "39") {
                currentMesh.rotate(BABYLON.Axis.Z, -(Math.PI / 2), BABYLON.Space.WORLD);
            }
        }
        var down = function (e) {
            if (e.keyCode == "40") {
                currentMesh.rotate(BABYLON.Axis.X, -(Math.PI / 2), BABYLON.Space.WORLD);
            }
        }

        var posUp = function (e) {
            if (e.keyCode == "187") {
                currentMesh.position.y += 0.2;
            }
        }

        var posDown = function (e) {
            if (e.keyCode == "189") {
                currentMesh.position.y -= 0.2;
            }
        }

        var getGroundPosition = function () {
            // Use a predicate to get position on the ground
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                return mesh == ground;
            });
            if (pickinfo.hit) {

                return pickinfo.pickedPoint;
            }

            return null;
        }

        var onPointerDown = function (e) {
            if (e.button !== 0) {
                return;
            }

            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }


            var pickMesh = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                return mesh !== ground;
            });
            var unpickMesh = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                return mesh == ground;
            });

            var menu = document.querySelector('#materials-menu');


            if (pickMesh.hit) {
                clicks += 1;
                currentMesh = pickMesh.pickedMesh;

                console.log(currentMesh.name);

                if (currentMesh.name === 'Brick') {
                    currentMesh.actionManager = new BABYLON.ActionManager(scene);
                    currentMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                        addBrickBtn.addEventListener('click', function (e) {
                            buildBrick(currentMesh);
                        }, false);
                    }));
                } else if (currentMesh.name === 'Bamboo') {
                    currentMesh.actionManager = new BABYLON.ActionManager(scene);
                    currentMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                        addBrickBtn.addEventListener('click', function (e) {
                            buildBamboo(currentMesh);
                        }, false);
                    }));
                }


                if (clicks % 2 === 1) {

                    currentMesh.unfreezeWorldMatrix();

                    startingPoint = getGroundPosition(e);

                    if (startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            camera.detachControl(canvas);
                        }, 0);
                    }
                    hl = new BABYLON.HighlightLayer("hl1", scene);
                    hl.innerGlow = false;
                    hl.addMesh(currentMesh, BABYLON.Color3.Red(), true);

                    priceValue.textContent = currentMesh.price + ' zł';
                    window.price = currentMesh;
                    menu.style.display = 'block';
                    var getMeshName = currentMesh.name;
                    var meshName = menu.querySelector('.name');
                    meshName.textContent = getMeshName;

                    camera.detachControl(canvas);
                    canvas.addEventListener("keyup", posUp, false);
                    canvas.addEventListener("keyup", posDown, false);
                    canvas.addEventListener("keyup", left, false);
                    canvas.addEventListener("keyup", right, false);
                    canvas.addEventListener("keyup", up, false);
                    canvas.addEventListener("keyup", down, false);


                } else {
                    currentMesh.freezeWorldMatrix();
                    camera.attachControl(canvas, true);
                    startingPoint = null;
                    hl.removeMesh(currentMesh);
                    menu.style.display = 'none';
                    // canvas.removeEventListener("keyup", left, false);
                    // canvas.removeEventListener("keyup", right, false);
                    // canvas.removeEventListener("keyup", up, false);
                    // canvas.removeEventListener("keyup", down, false);
                }
            } else if (unpickMesh.hit && (currentMesh != null)) {
                currentMesh.freezeWorldMatrix();
                camera.attachControl(canvas, true);
                startingPoint = null;
                hl.removeMesh(currentMesh);
                currentMesh = null;
                menu.style.display = 'none';
                canvas.removeEventListener("keyup", posUp, false);
                canvas.removeEventListener("keyup", posDown, false);
                canvas.removeEventListener("keyup", left, false);
                canvas.removeEventListener("keyup", right, false);
                canvas.removeEventListener("keyup", up, false);
                canvas.removeEventListener("keyup", down, false);
            }
        }

        function nearest(number, n) {
            return Math.round(number / n) * n;
        }

        var onPointerMove = function (evt) {

            if (!startingPoint) {
                return;
            }

            var current = getGroundPosition(evt);

            if (!current) {
                return;
            }

            var diff = current.subtract(startingPoint);
            var diff = new BABYLON.Vector3(nearest(diff.x, 1), 0, nearest(diff.z, 1));

            currentMesh.position.addInPlace(diff);

            startingPoint = currentMesh.position;

        }

        var onPointerUp = function () {
            if (startingPoint) {
                // camera.attachControl(canvas, true);
                startingPoint = null;
                return;
            }
        }


        let allMeshes = scene.meshes;

        for (let i = 0; i < allMeshes.length; i++) {
            let mesh = allMeshes[i];
            mesh.enableEdgesRendering();
            mesh.edgesWidth = 1;
            mesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
        }

        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointermove", onPointerMove, false);
        canvas.addEventListener("pointerup", onPointerUp, false);

        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointermove", onPointerMove);
            canvas.removeEventListener("keyup", left, false);
            canvas.removeEventListener("keyup", right, false);
            canvas.removeEventListener("keyup", up, false);
            canvas.removeEventListener("keyup", down, false);
            hl.removeMesh(currentMesh);
            menu.style.display = 'none';
        }

        return scene;

    }

    // var scene; // Removing duplicate global var
    try {
        scene = createScene(); // scene was already declared at top but scoped?
        // Wait, 'scene' declared at line 739 is correct if 'createScene' is just a function.
        // But createScene returns scene, so we assign it.
        // However, we should make sure we are not shadowing if that was the intent.
        // Line 128 'var scene' inside createScene shadows nothing because it's function scoped.
    } catch (err) {
        console.error('createScene() threw:', err);
    }

    if (scene && engine) {
        engine.runRenderLoop(function () {
            try {
                scene.render();
            } catch (err) {
                console.error('Error during scene.render():', err);
            }
        });
    } else {
        console.error('Not starting render loop: scene or engine is undefined', { scene: !!scene, engine: !!engine });
    }

    window.addEventListener('resize', function () {
        try {
            engine.resize();
        } catch (err) {
            console.error('Error during engine.resize():', err);
        }
    });
});
