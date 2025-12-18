window.addEventListener('DOMContentLoaded', function () {
    var app = document.querySelector('#app');
    var canvas = document.getElementById('renderCanvas');
    try { canvas.tabIndex = 0; } catch (e) { }
    var engine = new BABYLON.Engine(canvas, true, { stencil: true });

    window.onerror = function (msg, src, line, col, error) {
        console.error('Unhandled error:', msg, 'at', src + ':' + line + ':' + col, error);
        var overlay = document.getElementById('js-error-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'js-error-overlay';
            overlay.style.position = 'fixed';
            overlay.style.left = '10px'; overlay.style.right = '10px'; overlay.style.bottom = '10px';
            overlay.style.zIndex = 99999; overlay.style.background = 'rgba(200,0,0,0.85)';
            overlay.style.color = '#fff'; overlay.style.padding = '12px'; overlay.style.borderRadius = '6px';
            overlay.style.fontFamily = 'monospace'; overlay.style.fontSize = '13px';
            document.body.appendChild(overlay);
        }
        overlay.textContent = 'JS Error: ' + msg + ' (see console for details)';
    };

    app.style.display = 'flex';
    canvas.style.display = 'block';
    engine.resize();

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

    var materialName = document.querySelector('.name'),
        typeOfWood = document.querySelector('.type'),
        oakWood = document.querySelector('.oak span'),
        courbarilWood = document.querySelector('.courbaril span'),
        price = document.querySelector('.price span:first-of-type'),
        toggleTypeOfWood = document.querySelector('.type'),
        woodType = document.querySelectorAll('.wood-type');

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

    var addBrickBtn = document.querySelector('.add');
    var currentMesh = null;
    var meshArr = [];
    var bricks = [];
    var startingPoint;
    var hl;
    var clicks = 0;

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;

        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -30), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);

        var cameraPlan = new BABYLON.FreeCamera('cameraPlan', new BABYLON.Vector3(0, 50, 0), scene);
        cameraPlan.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        cameraPlan.setTarget(BABYLON.Vector3.Zero());

        var updateOrthoCoords = function () {
            var ratio = canvas.width / canvas.height;
            var zoom = 25;
            cameraPlan.orthoTop = zoom;
            cameraPlan.orthoBottom = -zoom;
            cameraPlan.orthoLeft = -zoom * ratio;
            cameraPlan.orthoRight = zoom * ratio;
        };
        updateOrthoCoords();
        window.updateOrthoCoords = updateOrthoCoords;

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.specular = new BABYLON.Color3(0, 0, 0);

        var grid = new BABYLON.GridMaterial('grid', scene);
        grid.mainColor = new BABYLON.Color3.FromInts(90, 100, 110);
        grid.lineColor = new BABYLON.Color3.FromInts(205, 230, 250);
        grid.gridRatio = 2;

        var ground = BABYLON.MeshBuilder.CreateGround('ground', { height: 48, width: 48 }, scene);
        ground.material = grid;
        ground.checkCollisions = true;

        var brickMaterial = new BABYLON.StandardMaterial('brickMat', scene);
        brickMaterial.diffuseTexture = new BABYLON.Texture("img/textures/brick.jpg", scene);
        brickMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var whiteMaterial = new BABYLON.StandardMaterial('whiteMat', scene);
        whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        whiteMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var courbaril = new BABYLON.StandardMaterial("courbaril", scene);
        courbaril.ambientTexture = new BABYLON.Texture("img/textures/wood/courbaril_texture.png", scene);
        courbaril.emissiveColor = new BABYLON.Color3(1, 1, 1);

        var oak = new BABYLON.StandardMaterial("oak", scene);
        oak.ambientTexture = new BABYLON.Texture("img/textures/wood/oak_texture.png", scene);
        oak.emissiveColor = new BABYLON.Color3(1, 1, 1);

        var wenge = new BABYLON.StandardMaterial("wenge", scene);
        wenge.ambientTexture = new BABYLON.Texture("img/textures/wood/wenge-dark_texture.png", scene);
        wenge.emissiveColor = new BABYLON.Color3(1, 1, 1);

        var brickInfo = {
            name: 'Brick',
            position: { x: 3, y: 0.25, z: 0.5 },
            material: brickMaterial,
            width: 2, height: 0.5, depth: 1, price: 0.20
        };

        var createBrick = function () {
            var brick = BABYLON.MeshBuilder.CreateBox(brickInfo.name, {
                height: brickInfo.height, width: brickInfo.width, depth: brickInfo.depth
            }, scene);
            brick.price = brickInfo.price;
            brick.position.copyFromFloats(brickInfo.position.x, brickInfo.position.y, brickInfo.position.z);
            brick.material = brickInfo.material;
            brick.checkCollisions = true;
            bricks.push(brick);
        };
        createBrick();

        var block;
        BABYLON.SceneLoader.ImportMesh("Cube", "", "meshes/cube3.babylon", scene, function (meshes) {
            mesh = meshes[0];
            block = meshes[0];
            mesh.name = 'Block';
            mesh.material = wenge;
            mesh.position.y = 1;
            mesh.position.z = -6;
            mesh.checkCollisions = true;
            meshArr.push(mesh);
        });

        var bamboo = BABYLON.MeshBuilder.CreateCylinder("Bamboo", { diameterTop: 0.4, diameterBottom: 0.4, height: 6 }, scene);
        bamboo.material = oak;
        bamboo.position.y = 3;

        var buildBrick = function (targetMesh) {
            if (!targetMesh) return;
            var selectedStyle = document.getElementById('brick-style').value;
            var newBrick = bricks[0].clone("Brick");
            newBrick.position = targetMesh.position.clone();
            newBrick.position.y += brickInfo.height;
            newBrick.rotation = targetMesh.rotation.clone();
            newBrick.checkCollisions = true;

            if (selectedStyle === 'white') {
                newBrick.material = whiteMaterial;
                newBrick.enableEdgesRendering();
                newBrick.edgesWidth = 2;
                newBrick.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
            } else {
                newBrick.material = brickMaterial;
                newBrick.enableEdgesRendering();
                newBrick.edgesWidth = 1;
                newBrick.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
            }
            bricks.push(newBrick);
        };

        var buildBamboo = function (targetMesh) {
            if (!targetMesh) return;
            var newBamboo = bamboo.clone("Bamboo");
            newBamboo.position = targetMesh.position.clone();
            newBamboo.position.y += 6;
            newBamboo.checkCollisions = true;
        };

        addBrickBtn.addEventListener('click', function () {
            if (!currentMesh) return;
            if (currentMesh.name === 'Brick') buildBrick(currentMesh);
            else if (currentMesh.name === 'Bamboo') buildBamboo(currentMesh);
        });

        var isPlanMode = false;
        var planPoints = [];
        var planLines = null;
        var planMarkers = [];

        var toggleViewBtn = document.getElementById('toggle-view');
        var generateHouseBtn = document.getElementById('generate-house');
        var clearPlanBtn = document.getElementById('clear-plan');

        toggleViewBtn.addEventListener('click', function () {
            isPlanMode = !isPlanMode;
            var settings = document.getElementById('house-settings');
            if (isPlanMode) {
                scene.activeCamera = cameraPlan;
                cameraPlan.attachControl(canvas, false);
                camera.detachControl(canvas);
                toggleViewBtn.innerHTML = '<i class="fas fa-cube"></i> <span>3D View</span>';
                generateHouseBtn.style.display = 'flex';
                clearPlanBtn.style.display = 'flex';
                if (settings) settings.style.display = 'flex';
                updateOrthoCoords();
            } else {
                scene.activeCamera = camera;
                camera.attachControl(canvas, true);
                cameraPlan.detachControl(canvas);
                toggleViewBtn.innerHTML = '<i class="fas fa-map"></i> <span>Plan View</span>';
                generateHouseBtn.style.display = 'none';
                clearPlanBtn.style.display = 'none';
                if (settings) settings.style.display = 'none';
            }
        });

        var updatePlanLines = function () {
            if (planLines) planLines.dispose();
            if (planPoints.length < 2) return;
            var points = planPoints.map(p => new BABYLON.Vector3(p.x, 0.1, p.z));
            if (planPoints.length > 2) points.push(points[0].clone());
            planLines = BABYLON.MeshBuilder.CreateLines("planLines", { points: points }, scene);
            planLines.color = new BABYLON.Color3(1, 1, 0);
        };

        generateHouseBtn.addEventListener('click', function () {
            if (planPoints.length < 2) return;
            var brickTemplate = bricks[0];
            var brickWidth = 2;
            var numLevels = parseInt(document.getElementById('house-levels').value) || 1;
            var selectedStyle = document.getElementById('brick-style').value;

            for (var i = 0; i < planPoints.length; i++) {
                var p1 = planPoints[i];
                var p2 = planPoints[(i + 1) % planPoints.length];
                if (planPoints.length === 2 && i === 1) break;

                var diff = p2.subtract(p1);
                var distance = diff.length();
                var direction = diff.normalize();
                var numBlocks = Math.floor(distance / brickWidth);
                var angle = Math.atan2(direction.x, direction.z);

                for (var h = 0; h < numLevels; h++) {
                    var isOffsetLayer = (h % 2 === 1);
                    // For offset layers, we might place one less block if the distance is tight, 
                    // or just shift them and let them overlap slightly at corners.
                    // Simple Running Bond: shift the blocks by half width
                    var currentNumBlocks = isOffsetLayer ? numBlocks : numBlocks;

                    for (var j = 0; j < currentNumBlocks; j++) {
                        var newBrick = brickTemplate.clone("Brick");
                        var offset = isOffsetLayer ? brickWidth / 2 : 0;
                        
                        newBrick.position.x = p1.x + direction.x * (j * brickWidth + brickWidth / 2 + offset);
                        newBrick.position.z = p1.z + direction.z * (j * brickWidth + brickWidth / 2 + offset);
                        newBrick.position.y = 0.25 + (h * 0.5);
                        newBrick.rotation.y = angle + Math.PI / 2;
                        newBrick.checkCollisions = true;

                        if (selectedStyle === 'white') {
                            newBrick.material = whiteMaterial;
                            newBrick.enableEdgesRendering();
                            newBrick.edgesWidth = 2;
                            newBrick.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
                        } else {
                            newBrick.material = brickMaterial;
                            newBrick.enableEdgesRendering();
                            newBrick.edgesWidth = 1;
                            newBrick.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
                        }
                        bricks.push(newBrick);
                    }
                }
            }
            toggleViewBtn.click();
            clearPlanBtn.click();
        });

        clearPlanBtn.addEventListener('click', function () {
            planPoints = [];
            if (planLines) planLines.dispose();
            planLines = null;
            planMarkers.forEach(m => m.dispose());
            planMarkers = [];
        });

        var getGroundPosition = function () {
            var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
            return pickinfo.hit ? pickinfo.pickedPoint : null;
        };

        var nearest = (number, n) => Math.round(number / n) * n;

        var onPointerDown = function (e) {
            if (e.button !== 0) return;
            if (isPlanMode) {
                var pickedPoint = getGroundPosition();
                if (pickedPoint) {
                    planPoints.push(pickedPoint);
                    var marker = BABYLON.MeshBuilder.CreateSphere("marker", { diameter: 0.5 }, scene);
                    marker.position = pickedPoint;
                    marker.material = new BABYLON.StandardMaterial("markerMat", scene);
                    marker.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
                    planMarkers.push(marker);
                    updatePlanLines();
                }
                return;
            }

            var pickMesh = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
            var menu = document.querySelector('#materials-menu');

            if (pickMesh.hit) {
                clicks += 1;
                currentMesh = pickMesh.pickedMesh;
                if (clicks % 2 === 1) {
                    currentMesh.unfreezeWorldMatrix();
                    startingPoint = getGroundPosition();
                    if (startingPoint) camera.detachControl(canvas);
                    hl = new BABYLON.HighlightLayer("hl1", scene);
                    hl.addMesh(currentMesh, BABYLON.Color3.Red());
                    menu.style.display = 'block';
                    document.querySelector('.name').textContent = currentMesh.name;
                } else {
                    currentMesh.freezeWorldMatrix();
                    camera.attachControl(canvas, true);
                    startingPoint = null;
                    if (hl) hl.dispose();
                    menu.style.display = 'none';
                }
            } else {
                if (currentMesh) {
                    currentMesh.freezeWorldMatrix();
                    camera.attachControl(canvas, true);
                    startingPoint = null;
                    if (hl) hl.dispose();
                    currentMesh = null;
                    menu.style.display = 'none';
                }
            }
        };

        var onPointerMove = function () {
            if (!startingPoint || !currentMesh) return;
            var current = getGroundPosition();
            if (!current) return;
            var diff = current.subtract(startingPoint);
            diff = new BABYLON.Vector3(nearest(diff.x, 1), 0, nearest(diff.z, 1));
            currentMesh.position.addInPlace(diff);
            startingPoint = currentMesh.position.clone();
        };

        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointermove", onPointerMove, false);
        return scene;
    };

    var scene = createScene();
    engine.runRenderLoop(function () {
        if (scene) scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
        if (window.updateOrthoCoords) window.updateOrthoCoords();
    });
});
