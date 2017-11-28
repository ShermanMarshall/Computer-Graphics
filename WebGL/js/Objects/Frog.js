function frog(vertex) {
    if ((vertex === undefined) || (typeof vertex !== 'THREE.Vector3')) {
        vertex = new THREE.Vector3(1,0,0);
    } 
    
    var array = [vertex];
    var geom = new THREE.Geometry();
    
    geom.vertices = array;
    geom.faces = [];
    geom.vertices.push(new THREE.Vector3(0, 1, 0));
    geom.vertices.push(new THREE.Vector3(0, 0,1));
    geom.vertices.push(new THREE.Vector3(1,0,0));
    geom.vertices.push(new THREE.Vector3(0,-1,0));
    geom.vertices.push(new THREE.Vector3(0,0,1));
    
    /*
    for (var x = 1; x < 2; x++) {
        console.log(x * (Math.PI/2));
        geom.vertices.push(new THREE.Vector3(-1, -1*(x*(Math.PI/2)), x*(Math.PI/2)));
        geom.vertices.push(new THREE.Vector3(1, (1+x)*(Math.PI/2), (1+x)*(Math.PI/2)));
    }
    */
    //console.log(geom.vertices);
    //var geom = new THREE.Geometry();
    //geom.vertices = array;
    /*
    geom.vertices.push(new THREE.Vector3(0.5, 2.5, 1.5));
    geom.vertices.push(new THREE.Vector3(1.5, 2.5, 0.5));
    geom.vertices.push(new THREE.Vector3(0.5,1.5, 2.5));
    */
    geom.faces.push(new THREE.Face3(0, 1, 2));
    geom.faces.push(new THREE.Face3(3,4,5));
    /*
    geom.faces.push(new THREE.Face3(0, 2, 3));
    geom.faces.push(new THREE.Face3(0, 4, 5));
    geom.faces.push(new THREE.Face3(0, 5, 6));
    */
    
    //geom.computeFaceNormals();
    //console.log(typeof new THREE.Vector3());
    var mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: 0xFF0000}));
    mesh.position.set(-5,0,0);
    mesh.rotation.x = 1.2
    return mesh;
}