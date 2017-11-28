function tree(theta, radius, height) {
    if (height <= 0)
        height = 1;
    var tree = {vertices: [], faces: []};
    var vertices = [], faces = [];
    var rad = Math.PI/180;
    var y = 0;
    var diff = 1;
    var factor = .2;
    var terminate = (1/factor);
    for (var z = factor, iterations = 0; iterations < terminate;  iterations++) {
    //for (; radius > 0; radius -= .2) {    
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius*(diff-z)),
                //(1 * (z*10)),
                iterations+1,
                Math.sin(x*rad)*(radius*(diff-z))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(diff - (z -factor)),//(radius-(factor*iterations)),
                iterations,
                Math.sin(x*(rad))*(diff - (z -factor))//(radius-(factor*iterations))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(diff - (z -factor)),//(radius-(factor*iterations)),
                iterations,
                Math.sin((x+theta)*(rad))*(diff - (z -factor))//(radius-(factor*iterations))
            ));
            faces.push(new THREE.Face3(y++, y++, y++));
        }
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(radius*(diff-z)),
                //(1*(z*10)),
                iterations+1,
                Math.sin((x+theta)*(rad))*(radius*(diff-z))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius*(diff-z)),
                //(1*(z*10)),
                iterations+1,
                Math.sin(x*(rad))*(radius*(diff-z))
            ));        
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(diff - (z -factor)),//radius-(factor*iterations)),
                iterations,
                Math.sin((x+theta)*rad)*(diff - (z -factor))//(radius-(factor*iterations))
            )); 
            faces.push(new THREE.Face3(y++, y++, y++));
        }
        z += (iterations < (terminate/2)) ? factor : -1*factor;
    }
    
    var test, near = false, far = false;
    while (true) {
        var branch = vertices[Math.round(Math.random() * (vertices.length-1))];
        if (branch.y > 3)
            break;
    }
    var delta = {x: branch.x, y: branch.y/2, z: branch.z};
    
    var aCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
            branch.x, 
            branch.y, 
            branch.z
        ),        
        /*
        new THREE.Vector3(
            delta.x + ((delta.x) * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.y + (delta.y * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.z + ((delta.z) * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3))
        ),
        */
        new THREE.Vector3(
            delta.x + ((delta.x) * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.y + ((delta.y) * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3)), 
            delta.z + ((delta.z) * (Math.random() * 3 > 1.5 ? -1 : 1) * (Math.random() * 3))
        ),
        new THREE.Vector3(
            delta.x + delta.x, 
            (delta.y + delta.y), 
            delta.z + delta.z
        )
    );
    var quadGeom = new THREE.Path(aCurve.getPoints(50)).createPointsGeometry(50);
    
    var lineGeom2 = new THREE.Geometry();
    lineGeom2.vertices = aCurve.getPoints(50);
    //curve2 = lineGeom2.vertices;
    //console.log(lineGeom);
    var line2 = new THREE.Line(lineGeom2, 
        new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 1 })
    );
    //line.position.set(0,1,0);
    tree.line = line2;
    
    tree.vertices = vertices;
    tree.faces = faces;
    console.log(vertices.length);
    console.log(Utils.projectsOutward(vertices, {x:0,y:0,z:0}));
    return tree;
}