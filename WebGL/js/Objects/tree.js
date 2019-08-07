var Utils = new Utils();
/**
 * Returns the vector coords corresponding with a tree
 * @param {type} theta: angular specificity
 * @param {type} radius: width of tree (-|-)
 * @param {type} height: number of stacked pairs
 * @returns {undefined}
 */
function tree(theta, radius, height) {
    var curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(1.5, 1.5, 0),
        new THREE.Vector3(0.01, 4.5, 0),
        new THREE.Vector3(1.5, 7.5, 0)
    );
    var quadMat = new THREE.LineBasicMaterial({ color: new THREE.Color(0xff0000), lineWidth: 1 });
    var quadGeom = new THREE.Geometry();
    quadGeom.vertices = curve.getPoints(50);

    var verts = [];
    var faces = [];
    var facePtr = 0;
    var factor = theta;
    for (var points = 0, rate = theta/2; points < (quadGeom.vertices.length-rate); points+=rate) {
        for (var x = 0; x < 360; x+=factor) {
            verts.push(Utils.rotatey(quadGeom.vertices[points], x, true));
            verts.push(Utils.rotatey(quadGeom.vertices[points+rate], x, true));
            verts.push(Utils.rotatey(quadGeom.vertices[points+rate], x+factor, true));
            
            verts.push(Utils.rotatey(quadGeom.vertices[points], x+factor, true));
            verts.push(Utils.rotatey(quadGeom.vertices[points], x, true));
            verts.push(Utils.rotatey(quadGeom.vertices[points+rate], x+factor, true));
            
            faces.push(new THREE.Face3(facePtr++, facePtr++, facePtr++));
            faces.push(new THREE.Face3(facePtr++, facePtr++, facePtr++));
        }
    }

    var test, near = false, far = false;
    while (true) {
        var branch = verts[Math.round(Math.random() * (verts.length-1))];
        if (branch.y > 5)
            break;
    }
    var delta = {x: branch.x, y: branch.y, z: branch.z};
    var aCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
            branch.x, 
            branch.y, 
            branch.z
        ),                
        new THREE.Vector3(
            delta.x + ((delta.x) * ((Math.random() * 3) > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.y,
            delta.z + ((delta.z) * ((Math.random() * 3) > 1.5 ? -1 : 1) * (Math.random() * 3))
        ),        
        new THREE.Vector3(
            delta.x + ((delta.x) * ((Math.random() * 3) > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.y,
            delta.z + ((delta.z) * ((Math.random() * 3) > 1.5 ? -1 : 1) * (Math.random() * 3))
        )
    );
    var quadGeom = new THREE.Path(aCurve.getPoints(50)).createPointsGeometry(50);

    var branchLine = new THREE.Geometry();
    branchLine.vertices = aCurve.getPoints(50);
    
    var line2 = new THREE.Line(branchLine, 
        new THREE.LineBasicMaterial({ color: 0xf4a460, linewidth: 1 })
    );
    
    for (var points = 0, rate=theta/2; points < (branchLine.vertices.length - (rate + 1)); points+=rate) {
        for (var x = 0; x < 360; x+=factor) {
            
            verts.push(Utils.rotateww(branchLine.vertices[points], branchLine.vertices[points+1], x));
            verts.push(Utils.rotateww(branchLine.vertices[points+rate], branchLine.vertices[points+rate+1], x));
            verts.push(Utils.rotateww(branchLine.vertices[points+rate], branchLine.vertices[points+rate+1], x + factor));
            
            verts.push(Utils.rotateww(branchLine.vertices[points], branchLine.vertices[points+1], x + factor));
            verts.push(Utils.rotateww(branchLine.vertices[points], branchLine.vertices[points+1], x));
            verts.push(Utils.rotateww(branchLine.vertices[points+rate], branchLine.vertices[points+rate+1], x+factor));
            
            faces.push(new THREE.Face3(facePtr++, facePtr++, facePtr++));
            faces.push(new THREE.Face3(facePtr++, facePtr++, facePtr++));
        }
    }
    
    console.log(verts);
    var geom = new THREE.Geometry();
    geom.vertices = verts;
    geom.faces = faces;
    geom.computeFaceNormals();
    var mesh = new THREE.SceneUtils.createMultiMaterialObject(geom, [
            new THREE.MeshLambertMaterial({ color: 0xf4a460, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ]
    );
    return {mesh: mesh, line: line2, geom: geom};
}
