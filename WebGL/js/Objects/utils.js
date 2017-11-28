function Utils() {
    this.origin = {x:0,y:0,z:0};
    this.rad = Math.PI/180;
};

Utils.prototype.translate = function(vector, direction, rate) {
    
};

/**
 * Checks whether the projection encounters its parent object
 * @param {type} vertices : set of vertices for comparison
 * @param {type} vector : vector to project
 * @returns {undefined}
 */
Utils.prototype.projectsOutward = function(vertices, vector) {
    if (vertices instanceof Array) {
        //console.log(vector);
        for (var x = 0; x < vertices.length; x++) {
            //console.log(this.findMagnitude(vertices[x]) < this.findMagnitude(vector) ? vertices[x] : undefined);
            if (this.findMagnitude(vertices[x]) < this.findMagnitude(vector)) {
                return false;
	    }
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
 * @param {number} p : The vector basis for the magnitude
 * @returns {Number|magnitude} the magnitude of the vector
 */
Utils.prototype.findMagnitude = function(p) {    
    return Math.sqrt(Math.pow(p.x,2) + Math.pow(p.y,2) + Math.pow(p.z,2));     
};

Utils.prototype.rotatex = function(vector, angle, y, z) {
    var yrad, zrad, dta = this.rad*angle;
    if (y === true)
        yrad = vector.y;
    else
        yrad = y === undefined ? 1 : y;
    if (z === true)
        zrad = vector.z;
    else
        zrad = z === undefined ? 1 : z;
    return new THREE.Vector3(
        vector.x,
        (Math.cos(dta) * yrad) - (Math.sin(dta) * zrad),
        (Math.sin(dta) * yrad) + (Math.cos(dta) * zrad)
    );
};

Utils.prototype.rotatey = function(vector, angle, x, z) {    
    var xrad, zrad, dta = this.rad*angle;
    if (x === true) {
        xrad = vector.x;
    } else {
        xrad = x === undefined ? 1 : x;
    }
    
    if (z === true) {
        zrad = vector.z;
    } else {
        zrad = z === undefined ? 1 : z;
    }
    
    return new THREE.Vector3(
        (Math.cos(dta)*xrad) + (Math.sin(dta)*zrad),
        vector.y,
        (-Math.sin(dta)*xrad) + (Math.cos(dta)*zrad)
    );
};

Utils.prototype.rotatez = function(vector, angle, x, y) {
    var xrad, yrad, dta = this.rad*angle;
    if (x === true)
        xrad = vector.x;
    else
        xrad = x === undefined ? 1 : x;
    
    if (y === true)
        yrad = vector.y;
    else
        yrad = y === undefined ? 1 : y;
    
    return new THREE.Vector3(
        (Math.cos(dta) * xrad) - (Math.sin(dta) *yrad),       
        -1 * (Math.sin(dta) * xrad) + (Math.cos(dta) * yrad),
        vector.z
    );
};

Utils.prototype.rotatew = function(vector, angle) {
    //Get vector magnitude
    var magnitude = this.findMagnitude(vector);
    //Find unit vector based on magnitude
    var uv = {
        x: vector.x/magnitude,
        y: vector.y/magnitude,
        z: vector.z/magnitude
    };
    //
    //vector.x+=.5, vector.y+=.5, vector.z+=.5;
    var xn = 0, yn = 0, zn = 0;
    return new THREE.Vector3(
        (((1+((1-Math.cos(angle))*(Math.pow(uv.x,2)-1)))*(vector.x+xn))+(((-1*uv.z*Math.sin(angle))+((1-Math.cos(angle))*uv.x*uv.y))*(vector.y+yn))+((((uv.y*Math.sin(angle))+((1-Math.cos(angle))*uv.x*uv.z)))*(vector.z+zn))),
        ((((uv.z*Math.sin(angle))+((1-Math.cos(angle))*uv.y*uv.x))*(vector.x+xn))+((1+((1-Math.cos(angle))*(Math.pow(uv.y,2)-1)))*(vector.y+yn))+(((-1*uv.x*Math.sin(angle))+((1-Math.cos(angle))*uv.y*uv.z))*(vector.z+zn))),
        (((-1*uv.y*Math.sin(angle))+((1-Math.cos(angle))*uv.z*uv.x))*(vector.x+xn))+(((uv.x*Math.sin(angle))+(1-Math.cos(angle))*uv.z*uv.y)*(vector.y+yn))+((1+((1-Math.cos(angle)))*(Math.pow(uv.z,2)-1))*(vector.z+zn))
    );
};

Utils.prototype.rotateww = function(vector1, vector2, angle) {
        var v1 = vector1;
	var v2 = vector2;

        var differenceToOrigin = {x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };

        var diffY = Math.atan(Math.abs(differenceToOrigin.x) / Math.abs(differenceToOrigin.z)) - 90;

        var rotY = this.rotatey(differenceToOrigin,  diffY, true, true);

        var diffX = Math.atan(Math.abs(rotY.y) / Math.abs(rotY.x)) - 90;

        var rotX = this.rotatex(rotY, diffX, true, true);

        var rotated = this.rotatez(rotX, angle, true, 0.5);

        var rotX2 = this.rotatex(rotated, -diffX, true, true);

        var rotY2 = this.rotatey(rotX2, -diffY, true, true);

        return new THREE.Vector3(v1.x + rotY2.x, v1.y + rotY2.y, v1.z + rotY2.z);
};


Utils.createBezierCurve = function bezierCurve(order, segments, coords) {
    var data = [];
    /*
    var xBasis = makeBezierBasis(xCoords, order);
    var yBasis = makeBezierBasis(yCoords, order);
    var zBasis = makeBezierBasis(zCoords, order);
    */
    var bases = makeBezierBasis(coords, order);
    
    data.push(coords[0]);
    for (var x = 1, index = 1; x < (segments-1); x++, index++) {
        var t = 1; data[x] = new Vector3();
        for (var y = 0; y <= order; y++) {
            for (var z = 0; z < y; z++) {
                t *= x/segments;
            }
            var vertex = new Vector3();
            for (var q = 0; q < 3; q++) {
                var axis = (parseInt('x'+q, 36)).toString(36);
                vertex[axis] = t
            } 
            data.push()            
        }   
    }
    return data;
    
    function makeBezierBasis (array, order) {
        var geometryBasis = [];
        var n = order, a = order;
        var matrix = [[n+1]];
        for (var x = 0; x <= n; x++) {
            var coeff = coefficient(n, x);
            var localOrder = n - x;
            for (var y = 0; y <= n; y++) {
                if ( y <= order) {
                    matrix[y][x] = coeff * coefficient(order, y);
                    if ((order - y) % 2)
                        matrix[y][x] *= -1;
                } else {
                    matrix[y][x] = 0;
                }
            }
        }
            
        for (var x = 0; x <= a; x++) {
            geometryBasis[x] = new THREE.Vector3(); //0
            for (var y = 0; y <= a; y++) {
                //geometryBasis[x] += matrix[y][x] * array[y];
                for (var z = 0; z < 3; z++) {
                    var axis = parseInt('x'+z, 36).toString(36);
                    geometryBasis[x][axis] += matrix[y][x] * array[y][axis];
                }
            }
        }
        
        return geometryBasis;
    }
    
    function coefficient(n, i) {
        var iterations; var num, denom;
        num = denom = 1; iterations = n - 1;
        for (var x = n, y = 0; y < iterations; x--, y++)
            num *= x;
        for (var x = iterations; x > 1; x--)
            denom *= x;
        return num/denom;
    }
}


