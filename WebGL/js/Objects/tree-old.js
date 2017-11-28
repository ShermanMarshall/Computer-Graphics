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
    var factor = .2
    //for (var z = .1; z <= .1; z += .1) {
    for (; radius > 0; radius -= factor) {
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius *(diff-z)),
                (1 * (z*10)),
                Math.sin(x*rad)*(radius*(diff-z))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*radius,
                0,
                Math.sin(x*(rad))*radius
            ));
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*radius,
                0,
                Math.sin((x+theta)*(rad))*radius
            ));
            faces.push(new THREE.Face3(y++, y++, y++));
        }
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(radius*(diff-z)),
                (1*(z*10)),
                Math.sin((x+theta)*(rad))*(radius*(diff-z))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius*(diff-z)),
                (1*(z*10)),
                Math.sin(x*(rad))*(radius*(diff-z))
            ));        
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*radius,
                0,
                Math.sin((x+theta)*rad)*radius
            )); 
            faces.push(new THREE.Face3(y++, y++, y++));
        }
    }
    /*
    var n = vertices.length;
    for (var x = 0; x < n; x++) {
        var one = vertices[x];
        vertices.push(new THREE.Vector3(-one.x, -one.y, -one.z));
    }
    */
    tree.vertices = vertices;
    tree.faces = faces;
    return tree;
}