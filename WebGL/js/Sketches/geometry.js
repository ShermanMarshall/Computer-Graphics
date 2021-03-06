

var helper = new THREE.AxisHelper(20);        
var triangle = new THREE.Geometry();

var vertices = [
    /*
    new THREE.Vector3(1, 3, 1),
    new THREE.Vector3(1, 3, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 3, -1),        
    new THREE.Vector3(-20, -6, 1),
    new THREE.Vector3(2, 20, 1),
    new THREE.Vector3(10, 1, 20)
    */
    new THREE.Vector3(.5,0,0),
    new THREE.Vector3(0,.5,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(.5,0,0),
    new THREE.Vector3(.5,.5,0),
    new THREE.Vector3(0,.5,0),
    new THREE.Vector3(1,.5,0),
    new THREE.Vector3(.5,.5,0),
    new THREE.Vector3(1,0,0)
];

var faces = [
    new THREE.Face3(0, 1, 2, undefined, new THREE.Color(0xff0000)),
    new THREE.Face3(3, 4, 5, undefined, new THREE.Color(0x00ff00)),
    new THREE.Face3(6, 7, 8, undefined, new THREE.Color(0x0000ff))
    /*
    new THREE.Face3(3, 4, 5)
    new THREE.Face3(2, 3, 1),
    new THREE.Face3(4, 6, 5),
    new THREE.Face3(6, 7, 5),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(5, 0, 1),
    new THREE.Face3(7, 6, 2),
    new THREE.Face3(6, 3, 2),
    new THREE.Face3(5, 7, 0),
    new THREE.Face3(7, 2, 0),
    new THREE.Face3(1, 3, 4),
    new THREE.Face3(3, 6, 4),
    */
];

triangle.vertices = vertices;
triangle.faces = faces;

//triangle.vertices.push(new THREE.Vector3( 0.0,  1.0, 0.0)); 
//triangle.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0)); 
//triangle.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0)); 
//triangle.faces.push(new THREE.Face3(0, 1, 2)); 
triangle.computeFaceNormals();

var t = new THREE.Mesh(triangle, new THREE.MeshLambertMaterial({ color: 0xCDABCC }) );
//t.position.set(-5,-40,30);
scene.position.set(-25,30,25);
//scene.position.set(-5, 5, 5);
/*
scene.rotation.x = .3*Math.PI;
scene.rotation.z = .3*Math.PI;
*/
var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
var planeMaterial = new THREE.MeshLambertMaterial({
                        color: 0xCCABCD, wireframe: true });

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5*(Math.PI);
scene.add(helper);

var mat = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });//color: new THREE.Color(0xFF0000) });
var mesh = new THREE.Mesh(triangle, mat);
//mesh.position.set(-5,0,0);        

//console.log('here');
//console.log(mesh.material);

//var test = frog();
for (var y = 0; y < mesh.geometry.faces.length; y++)
    for (var x = 0; x < 3; x++) {
        var c = new THREE.Color(Math.random() * 0xffffff);
        mesh.geometry.faces[y].vertexColors[x] = c;
        //console.log(c);
    }

//console.log(test);
//scene.add(mesh);
scene.add(plane);
//scene.add(test);
var array1 = [], array2 = [], curve1, curve2;
var curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(2.5,2.5,2.5),
    //new THREE.Vector3(0,0,0),
    new THREE.Vector3(3.75,3.75, 0),
    //new THREE.Vector3(5,5,5),
    new THREE.Vector3(5,5,5)
);

var lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
var lineGeom = new THREE.Geometry();
lineGeom.vertices = curve.getPoints(50);
curve1 = lineGeom.vertices;
//console.log(lineGeom);
var line1 = new THREE.Line(lineGeom, lineMat);
line1.position.set(0,0,0);
scene.add(line1);

var quadCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(1.5, 1.5, 1.5),
    new THREE.Vector3(5,10,5)
);
var quadMat = new THREE.LineBasicMaterial({ color: 0x0c66ab, lineWidth: 1});
var quadGeom = new THREE.Geometry();
quadCurve.vertices = quadCurve.getPoints(50);

var line2 = new THREE.Line(quadGeom, quadMat);
line2.position.set(0,0,0);        
scene.add(line2);

var bcurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0,5,0),
    new THREE.Vector3(2.5,7.5,2.5),
    //new THREE.Vector3(0,5,0),
    new THREE.Vector3(3.75,8.75, 0),
    //new THREE.Vector3(5,10,5),
    new THREE.Vector3(5,10,5));

var lineGeom2 = new THREE.Geometry();
lineGeom2.vertices = bcurve.getPoints(50);
curve2 = lineGeom2.vertices;
//console.log(lineGeom);
var line2 = new THREE.Line(lineGeom2, 
    new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 1 })
);
//line.position.set(0,1,0);
scene.add(line2);

for (var x = 0, y = 0; x < (curve1.length-1); x++) {
    //if ((x % 2 ) == 0) {
        array1.push(curve1[x]);
        array1.push(curve1[x+1]);
        array1.push(curve2[x]);
        array2.push(new THREE.Face3(y++, y++,y++))
    //} else {
        array1.push(curve2[x]);
        array1.push(curve1[x+1]);//?wtf
        array1.push(curve2[x+1]);                
        array2.push(new THREE.Face3(y++, y++,y++));
    //}
}
// console.log(curve1, curve2);
//console.log(curve2);
var test = new THREE.Geometry();
test.vertices = array1;
test.faces = array2;
var testMesh = new THREE.MeshBasicMaterial({ color: 0xab0fab });
test.computeFaceNormals();
var fin = new THREE.Mesh(test, testMesh);
//scene.add(fin);

var tree = tree(20,1,1);
var treeGeometry = new THREE.Geometry();
var treeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });

treeGeometry.vertices = tree.vertices;
treeGeometry.faces = tree.faces;
console.log(treeGeometry.vertices, treeGeometry.faces);
treeGeometry.computeFaceNormals();

var theMesh = new THREE.Mesh(treeGeometry, treeMaterial);
theMesh.position.set(0,0,0);
//theMesh.rotation.z = Math.PI/4;
console.log(theMesh);
scene.add(theMesh);
//fin.position.set(0,0,0);

var light = new THREE.SpotLight(0xCCCCCC);
light.position.set(-10, 100, -4);        
scene.add(light);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
console.log(t.position);
camera.lookAt({ x: 50, y: -100, z: -50 });

$('#output').append(renderer.domElement);

//renderer.render(scene, camera);        
var x = 1;

function render() {
    /*
    x = (x++ > 10) ? -10 : x;
    line1.rotation.x = (Math.PI / x);
    line2.rotation.x = (Math.PI / x);
    fin.rotation.x = (Math.PI / x);
    console.log(fin.rotation.x);
    */
    //x = (x++ > 360) ? -10 : x;
    theMesh.rotation.y = (Math.PI/x);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
} 

//render();

//console.log(new THREE.Vector3());       
