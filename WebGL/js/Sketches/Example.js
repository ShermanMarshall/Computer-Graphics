    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0XFFFFFF);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Set axes with specified length
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    //Create a reference plane for objects
    var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshBasicMaterial({
                            color: 0x00ABCD});

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(8,20,8);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -10;
    cube.position.y = 5;
    cube.position.z = 0;

    scene.add(cube);
    var sphereGeometry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF, wireframe: true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    scene.add(sphere);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    $('#output').append(renderer.domElement);

    //Iteratively render the scene
    renderer.render(scene, camera); 