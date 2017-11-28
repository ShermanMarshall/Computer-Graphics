function Utils() {
    this.origin = {x:0,y:0,z:0};
    return this;
};

Utils.translate = function(vector, direction, rate) {
    
};

Utils.rotatex = function(vector, angle) {
    
};

/**
 * Checks whether the projection encounters its parent object
 * @param {type} vertices : set of vertices for comparison
 * @param {type} vector : vector to project
 * @returns {undefined}
 */
Utils.projectsOutward = function(vertices, vector) {
    if (vertices instanceof Array) {
        //console.log(vector);
        for (var x = 0; x < vertices.length; x++) {
            //console.log(this.findMagnitude(vertices[x]) < this.findMagnitude(vector) ? vertices[x] : undefined);
            if (this.findMagnitude(vertices[x]) < this.findMagnitude(vector))
                return false;
        }
    } else {
        alert('wrong format. check log');
        console.log(vertices);
        return false;
    }
    return true;
};

/**
 * Determine the magnitude of the vector from the reference (or origin)
 * @param {type} point : The vector basis for the magnitude
 * @param {type} ref : The reference point (or origin)
 * @returns {Number|magnitude} the magnitude of the vector
 */
Utils.findMagnitude = function(point, reference) {
    var p;
    if (reference === undefined)
        reference = {x: 0,y: 0, z: 0};    
    //console.log('point and reference', point, reference);
    p = (point instanceof THREE.Vector3) ? {x: point.x, y: point.y, z: point.z} : point;
    //console.log('prepared point and reference', p, reference);
    var x = p.x - reference.x, 
        y = p.y - reference.y, 
        z = p.z - reference.z, 
        base, 
        height; 
    if ((x > 0) && (y > 0) && (z > 0)) {                
        base = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2));
        height = (y);
        return (base * height)/2;        
    } else {
        if (x === 0) {
            return Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2));
        } else if (y === 0) {
            return Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2));
        } else if (z === 0) {
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        }
    }
};

/**
 * Returns the vector coords corresponding with a tree
 * @param {type} theta: angular specificity
 * @param {type} radius: width of tree (-|-)
 * @param {type} height: number of stacked pairs
 * @returns {undefined}
 */
function tree(theta, radius, height) {
    if (height <= 0)
        height = 1;
    var tree = {vertices: [], faces: []};
    var vertices = [], faces = [];
    var rad = Math.PI/180;
    var y = 0;
    var diff = 1;
    var factor = .1;
    for (var z = factor, iterations = 0; z < 1; z += factor, iterations++) {
    //for (; radius > 0; radius -= .2) {    
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius*(diff-z)),
                //(1 * (z*10)),
                iterations+1,
                Math.sin(x*rad)*(radius*(diff-z))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius-(factor*iterations)),
                iterations,
                Math.sin(x*(rad))*(radius-(factor*iterations))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(radius-(factor*iterations)),
                iterations,
                Math.sin((x+theta)*(rad))*(radius-(factor*iterations))
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
                Math.cos((x+theta)*(rad))*(radius-(factor*iterations)),
                iterations,
                Math.sin((x+theta)*rad)*(radius-(factor*iterations))
            )); 
            faces.push(new THREE.Face3(y++, y++, y++));
        }
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