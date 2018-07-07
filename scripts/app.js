        window.addEventListener('DOMContentLoaded', function () {

            var intro = document.querySelector('#intro');
            var app = document.querySelector('#app');
            var canvas = document.getElementById('renderCanvas');
            var engine = new BABYLON.Engine(canvas, true, {
                stencil: true
            });

            // function introHide() {
            intro.style.display = 'none';
            app.style.display = 'flex';
            canvas.style.display = 'block';
            engine.resize();
            // }
            // setTimeout(introHide, 1000);

            var switchLangBtn = document.querySelector('.lang');
            materialName = document.querySelector('.name'),
                typeOfWood = document.querySelector('.type'),
                oakWood = document.querySelector('.oak span');
            courbarilWood = document.querySelector('.courbaril span');
            price = document.querySelector('.price span:first-of-type');

            switchLangBtn.addEventListener('click', function (e) {
                if (switchLangBtn.classList.contains('pl')) {
                    materialName.textContent = "Bal";
                    typeOfWood.textContent = "Gatunek drewna";
                    oakWood.textContent = "Dąb";
                    courbarilWood.textContent = "Jatoba";
                    price.textContent = "Cena";
                    switchLangBtn.classList.remove('pl');
                    switchLangBtn.classList.add('en');

                } else {
                    switchLangBtn.classList.remove('en');
                    switchLangBtn.classList.add('pl');
                    materialName.textContent = "Block";
                    typeOfWood.textContent = "Type of wood";
                    oakWood.textContent = "Oak";
                    courbarilWood.textContent = "Courbaril";
                    price.textContent = "Price";
                }
            });



            var menu = document.querySelector('#materials-menu');
            var toggleBtn = document.querySelector('.toggle-menu');

            toggleBtn.addEventListener('click', function (e) {
                e.target.innerHTML = "";
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                    e.target.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
                } else {
                    menu.style.display = 'block';
                    e.target.innerHTML = '<i class="fas fa-times"></i>';
                }
            }), true;

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

                // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
                var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -30), scene);

                var camera2 = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 40, 0), scene);

                let cameraTopBtn = document.querySelector('.top-view');

                // cameraTopBtn.addEventListener('click', function (e) {
                //     camera = cameraTop;
                //     console.log(camera);
                // });

                var switchCam = true;

                cameraTopBtn.addEventListener("click", function (e) {
                    if (switchCam) {
                        scene.activeCamera = camera;
                    } else {
                        scene.activeCamera = camera2;
                    }
                    switchCam = !switchCam;
                })

                // Target the camera to scene origin.
                camera.setTarget(BABYLON.Vector3.Zero());
                camera2.setTarget(BABYLON.Vector3.Zero());


                // Attach the camera to the canvas.
                camera.attachControl(canvas, false);
                camera2.attachControl(canvas, false);

                // Create a basic light, aiming 0,1,0 - meaning, to the sky.
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
                light.specular = new BABYLON.Color3(0, 0, 0);
                // light.diffuse = new BABYLON.Color3(0, 0, 0);
                light.ambient = new BABYLON.Color3(1, 1, 1);
                light.emissive = new BABYLON.Color3(1, 1, 1);

                var brickMaterial = new BABYLON.StandardMaterial('brickMat', scene);
                // brickMaterial.diffuseColor = new BABYLON.Color3.FromInts(255, 102, 102);
                // brickMaterial.ambientColor = new BABYLON.Color3.FromInts(0, 0, 0);
                // brickMaterial.emissiveColor = new BABYLON.Color3.FromInts(255, 102, 102);
                // brickMaterial.specular = new BABYLON.Color3(0, 0, 0);
                // brickMaterial.ground = new BABYLON.Color3(0, 0, 0);

                // brickMaterial.specularTexture = new BABYLON.Texture("img/brick.jpg", scene);
                // brickMaterial.emissiveTexture = new BABYLON.Texture("img/brick.jpg", scene);
                // brickMaterial.ambientTexture = new BABYLON.Texture("img/brick.jpg", scene);
                brickMaterial.diffuseTexture = new BABYLON.Texture("img/textures/brick.jpg", scene);

                var courbaril = new BABYLON.StandardMaterial("courbaril", scene);
                courbaril.specularTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png",
                    scene);
                courbaril.emissiveTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png",
                    scene);
                courbaril.ambientTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png",
                    scene);
                courbaril.diffuse = new BABYLON.Color3(1, 1, 1);

                var oak = new BABYLON.StandardMaterial("oak", scene);
                oak.specularTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);
                oak.emissiveTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);
                oak.ambientTexture = new BABYLON.Texture("img/textures/wood/oak_texture2.png", scene);
                oak.diffuse = new BABYLON.Color3(1, 1, 1);

                var wenge = new BABYLON.StandardMaterial("wenge", scene);
                // wenge.diffuseTexture = new BABYLON.Texture("img/wood/wenge2.png", scene);
                wenge.specularTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png",
                    scene);
                wenge.emissiveTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png",
                    scene);
                wenge.ambientTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png",
                    scene);
                wenge.diffuse = new BABYLON.Color3(1, 1, 1);
                wenge.ambient = new BABYLON.Color3(1, 1, 1);
                wenge.specular = new BABYLON.Color3(1, 1, 1);
                wenge.emissive = new BABYLON.Color3(1, 1, 1);
                // // wenge.ambient = new BABYLON.Color3(1, 1, 1);
                // wenge.ground = new BABYLON.Color3(1, 1, 1);

                var meshArr = [];

                BABYLON.SceneLoader.ImportMesh("Cube", "", "meshes/cube3.babylon", scene, function (meshes) {
                    var mesh = meshes[0];
                    block = meshes[0];
                    mesh.id = "mesh 1";
                    mesh.material = wenge;
                    mesh.position.y = 1;
                    mesh.position.z = -6;
                    meshArr[0] = mesh;
                });



                var editMesh = function () {
                    var priceValue = document.querySelector('.value');
                    var getElement = document.querySelector('.material-img');
                    var removeElement = document.querySelector('.remove');
                    var setNumber = document.querySelector('.number');

                    getElement.addEventListener('click', function (e) {
                        var lastMesh = meshArr[meshArr.length - 1];
                        var newInstance = meshArr[0].clone();

                        if (meshArr.length === 1) {
                            newInstance.id = "mesh " + (meshArr.length + 1);
                            newInstance.position.x = lastMesh.position.x + 1.36;
                            meshArr.push(newInstance);
                            setNumber.textContent = (meshArr.length).toString();
                            priceValue.textContent = meshArr.length + ' zł';
                        } else {
                            newInstance.id = "mesh " + (meshArr.length + 1);
                            newInstance.position.x = lastMesh.position.x + 1.36;
                            meshArr.push(newInstance);
                            setNumber.textContent = (meshArr.length).toString();
                            priceValue.textContent = meshArr.length + ' zł';
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

                // var mergeBlocks = function() {
                //     var addBtn = document.querySelector('.add-block');
                //     addBtn.addEventListener('click', function() {
                //         var mesh = BABYLON.Mesh.MergeMeshes(meshArr);       
                //     }, false)
                // }

                // mergeBlocks();

                var buildBlock = function () {
                    var addBtn = document.querySelector('.add-block');
                    addBtn.addEventListener('click', function () {
                        var block = new BABYLON.SolidParticleSystem("block", scene);
                        for (let i = 0; i < meshArr.length; i++) {
                            var particle = meshArr[i];
                            var myBuilder = function (particle, i, s) {
                                particle.position.x = s * 2;
                                particle.color = new BABYLON.Color4(0.6, 0.6, 0.6, 1);
                            }
                            block.addShape(particle, meshArr.length, {
                                positionFunction: myBuilder
                            });
                        }
                        block.buildMesh();
                        block.mesh.position.y = 1;
                        block.mesh.material = oak;
                        console.log(block);
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

                var rotateMesh = function () {
                    var rotateX = document.querySelector('.horizontal');

                    rotateX.addEventListener('click', function (e) {
                        for (var i = 0; i < meshArr.length; i++) {
                            meshArr[i].rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
                        }
                    });

                    var rotateZ = document.querySelector('.vertical');

                    rotateZ.addEventListener('click', function (e) {
                        for (var i = 0; i < meshArr.length; i++) {
                            meshArr[i].rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
                        }
                    });
                }



                editMesh();
                chooseWood();
                rotateMesh();

                // cloneBlock();

                var brick = BABYLON.MeshBuilder.CreateBox('brick', {
                    height: 1,
                    width: 1,
                    depth: 1
                }, scene);

                brick.position.y = 1;

                brick.material = brickMaterial;

                var bricks = [];
                bricks.push(brick);




                // var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
                //     "UI");

                // var rotateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("btn",
                //     "img/angle-up.png");
                // rotateBtn.width = '30px';
                // rotateBtn.height = "50px";
                // // rotateBtn.color = "white";
                // rotateBtn.background = "white";
                // advancedTexture.addControl(rotateBtn);
                // rotateBtn.linkWithMesh(mesh);
                // rotateBtn.linkOffsetY = -150;

                // var rotateDownBtn = BABYLON.GUI.Button.CreateSimpleButton("btn2", "Rotate Down");
                // rotateDownBtn.width = 0.06;
                // rotateDownBtn.height = "40px";
                // rotateDownBtn.color = "white";
                // rotateDownBtn.background = "gray";
                // advancedTexture.addControl(rotateDownBtn);
                // rotateDownBtn.linkWithMesh(mesh);
                // rotateDownBtn.linkOffsetY = -100;



                // var wood = new BABYLON.StandardMaterial("wood", scene);

                // wood.diffuseTexture = new BABYLON.Texture("img/wood/wood2.png", scene);
                // wood.specularTexture = new BABYLON.Texture("img/wood/wood2.png", scene);
                // wood.emissiveTexture = new BABYLON.Texture("img/wood/wood2.png", scene);
                // wood.ambientTexture = new BABYLON.Texture("img/wood/wood2.png", scene);

                // var lightWood = new BABYLON.StandardMaterial("lightWood", scene);

                // lightWood.diffuseTexture = new BABYLON.Texture("img/wood/lightWood.png", scene);
                // lightWood.specularTexture = new BABYLON.Texture("img/wood/lightWood.png", scene);
                // lightWood.emissiveTexture = new BABYLON.Texture("img/wood/lightWood.png", scene);
                // lightWood.ambientTexture = new BABYLON.Texture("img/wood/lightWood.png", scene);

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

                var grid = new BABYLON.GridMaterial("grid", scene);
                grid.mainColor = new BABYLON.Color3.FromInts(255, 255, 255);
                grid.lineColor = new BABYLON.Color3.FromInts(204, 204, 204);
                grid.majorUnitFrequency = 3;

                // Create a built-in "ground" shape.
                var ground = BABYLON.MeshBuilder.CreateGround('ground1', {
                    height: 20,
                    width: 20,
                    subdivisions: 2
                }, scene);

                ground.material = concrete;

                scene.clearColor = new BABYLON.Color3.FromInts(200, 232, 255);

                // light.specularPower = 0;

                // ground.material = new BABYLON.GridMaterial("groundMaterial", scene);

                // Return the created scene.


                var startingPoint;
                var currentMesh;
                var hl;
                var clicks = 0;

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

                var onPointerDown = function (evt) {
                    if (evt.button !== 0) {
                        return;
                    }

                    // check if we are under a mesh
                    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                        return mesh !== ground;
                    });
                    if (pickInfo.hit) {
                        clicks += 1;
                        currentMesh = pickInfo.pickedMesh;
                        
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

                        if (clicks % 2 === 1) {
                
                            // currentMesh.position.x += 1;
                            startingPoint = getGroundPosition(evt);

                            if (startingPoint) { // we need to disconnect camera from canvas
                                setTimeout(function () {
                                    camera.detachControl(canvas);
                                }, 0);
                            }
                            hl = new BABYLON.HighlightLayer("hl1", scene);
                            hl.addMesh(currentMesh, BABYLON.Color3.Red(), true);
                            hl.innerGlow = false;

                            canvas.addEventListener("keyup", left, false);
                            canvas.addEventListener("keyup", right, false);
                            canvas.addEventListener("keyup", up, false);
                            canvas.addEventListener("keyup", down, false);
                        } else {
                            camera.attachControl(canvas, true);
                            startingPoint = null;
                            hl.removeMesh(currentMesh);
                            canvas.removeEventListener("keyup", left, false);
                            canvas.removeEventListener("keyup", right, false);
                            canvas.removeEventListener("keyup", up, false);
                            canvas.removeEventListener("keyup", down, false);
                        }
                    }
                }

                // window.addEventListener("keyup", event => {
                //     if (event.key == "v") {
                //         camera.attachControl(canvas, true);
                //         startingPoint = null;



                //     }
                //   });

                // var onPointerUp = function () {
                //     if (startingPoint) {
                //         camera.attachControl(canvas, true);
                //         startingPoint = null;
                //         return;
                //     }
                // }

                var onPointerMove = function (evt) {
                    if (!startingPoint) {
                        return;
                    }

                    var current = getGroundPosition(evt);

                    if (!current) {
                        return;
                    }

                    var diff = current.subtract(startingPoint);
                    currentMesh.position.addInPlace(diff);

                    startingPoint = current;

                    // var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
                    //     return mesh !== ground;
                    // });
                    // if (pickInfo.hit) {
                    //     currentMesh = pickInfo.pickedMesh;
                    //     // currentMesh.position.x += 1;
                    //     startingPoint = null;
                    //     camera.attachControl(canvas, true);
                    // }                
                }


                canvas.addEventListener("click", onPointerDown, false);
                // canvas.addEventListener("pointerup", onPointerUp, false);
                canvas.addEventListener("pointermove", onPointerMove, false);
                // canvas.addEventListener("pointerdown", function(){startingPoint = null}, false);


                scene.onDispose = function () {
                    canvas.removeEventListener("pointerdown", onPointerDown);
                    // canvas.removeEventListener("pointerup", onPointerUp);
                    canvas.removeEventListener("pointermove", onPointerMove);
                    canvas.removeEventListener("keyup", left, false);
                            canvas.removeEventListener("keyup", right, false);
                            canvas.removeEventListener("keyup", up, false);
                            canvas.removeEventListener("keyup", down, false);
                }

                return scene;
            }
            var scene = createScene();

            engine.runRenderLoop(function () {
                scene.render();
            });

            window.addEventListener('resize', function () {
                engine.resize();
            });
        });