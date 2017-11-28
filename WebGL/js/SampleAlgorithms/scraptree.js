for (var z = factor, iterations = 0; iterations < (1/factor); z += factor, iterations++) {
    //for (; radius > 0; radius -= .2) {    
        for (var x = 0; x < 360; x+= theta) {
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*((diff - ((z > (diff/2)) ? (diff - z) : z))),
                //(1 * (z*10)),
                iterations+1,
                Math.sin(x*rad)*((diff - ((z > (diff/2)) ? (diff - z) : z)))
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
                Math.cos((x+theta)*(rad))*(radius*(diff - ((z > (diff/2)) ? (diff - z) : z))),
                //(1*(z*10)),
                iterations+1,
                Math.sin((x+theta)*(rad))*(radius*(diff - ((z > (diff/2)) ? (diff - z) : z)))
            ));
            vertices.push(new THREE.Vector3(
                Math.cos(x*(rad))*(radius*(diff - ((z > (diff/2)) ? (diff - z) : z))),
                //(1*(z*10)),
                iterations+1,
                Math.sin(x*(rad))*(radius*(diff - ((z > (diff/2)) ? (diff - z) : z)))
            ));        
            vertices.push(new THREE.Vector3(
                Math.cos((x+theta)*(rad))*(radius-(factor*iterations)),
                iterations,
                Math.sin((x+theta)*rad)*(radius-(factor*iterations))
            )); 
            faces.push(new THREE.Face3(y++, y++, y++));
        }
    }
    