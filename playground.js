/* all zones */
var polygons = [];
var polygonID = 0;
var playgroundPolygon = {};

/* class defines type "Point" */
function Point(lat,lon) {
    this.x = getMercX(lon);
    this.y = getMercY(lat);
}

/* class defines polygon and its attributes and pushes them into polygons*/
function Polygon(p1,p2,p3,p4) {

    this.id = polygonID;
    this.points = [p1,p2,p3,p4];
    this.onDemand = false;

    polygonID++;
    polygons.push(this);
    
    
/*
    Struktur eines Polygons
    
    {
        id: …,
        points: […,…,…,…],
        onDemand: true/false,
        (team: 'A','B')
    }
*/

}


/* function inits all zones */
function initPlayground() {

    var p1 = new Point(50.979158, 11.329474366488867);
    var p2 = new Point(50.979195, 11.329469094272254);
    var p3 = new Point(50.97927, 11.329454324882825);
    var p4 = new Point(50.979347, 11.329439645414723);
    var p5 = new Point(50.979432, 11.329423947432945);
    var p6 = new Point(50.979514, 11.32940811445243);
    
    var p7 = new Point(50.979137, 11.32961005878701);
    var p8 = new Point(50.979199, 11.329601776363102);
    var p9 = new Point(50.979276, 11.329587097157455);
    var p10 = new Point(50.979355, 11.329575399478802);
    var p11 = new Point(50.979441, 11.329559746727957);
    var p12 = new Point(50.979525, 11.329546850581444);
    
    var p13 = new Point(50.979126, 11.329760523819425);
    var p14 = new Point(50.979204, 11.329748781478305);
    var p15 = new Point(50.979282, 11.329729877585573);
    var p16 = new Point(50.979364, 11.329712621880851);
    var p17 = new Point(50.979453, 11.329697149331636);
    var p18 = new Point(50.979536, 11.329681361816206);
    
    var p19 = new Point(50.979127, 11.329908772049723);
    var p20 = new Point(50.979207, 11.329894273334684);
    var p21 = new Point(50.979289, 11.329874126342164);
    var p22 = new Point(50.979373, 11.329856960871975);
    var p23 = new Point(50.979465, 11.32983735363617);
    var p24 = new Point(50.979552, 11.32981889970163);

    var p25 = new Point(50.979129, 11.3300570652777);
    var p26 = new Point(50.979212, 11.330039810200187);
    var p27 = new Point(50.979293, 11.330016816849964);
    var p28 = new Point(50.979379, 11.329995471698407);
    var p29 = new Point(50.979472, 11.329971639794852);
    var p30 = new Point(50.979562, 11.329953366079907);
    
    var p31 = new Point(50.979132, 11.330202511913853);
    var p32 = new Point(50.979216, 11.330183743796795);
    var p33 = new Point(50.979301, 11.330158264058195);
    var p34 = new Point(50.979389, 11.330136739231924);
    var p35 = new Point(50.979485, 11.330110465898002);
    var p36 = new Point(50.979574, 11.33008787751102);
    
    new Polygon(p1,p2,p8,p7);
    new Polygon(p2,p3,p9,p8);
    new Polygon(p3,p4,p10,p9);
    new Polygon(p4,p5,p11,p10);
    new Polygon(p5,p6,p12,p11);

    new Polygon(p7,p8,p14,p13);
    new Polygon(p8,p9,p15,p14);
    new Polygon(p9,p10,p16,p15);
    new Polygon(p10,p11,p17,p16);
    new Polygon(p11,p12,p18,p17);

    new Polygon(p13,p14,p20,p19);
    new Polygon(p14,p15,p21,p20);
    new Polygon(p15,p16,p22,p21);
    new Polygon(p16,p17,p23,p22);
    new Polygon(p17,p18,p24,p23);
    
    new Polygon(p19,p20,p26,p25);
    new Polygon(p20,p21,p27,p26);
    new Polygon(p21,p22,p28,p27);
    new Polygon(p22,p23,p29,p28);
    new Polygon(p23,p24,p30,p29);

    new Polygon(p25,p26,p32,p31);
    new Polygon(p26,p27,p33,p32);
    new Polygon(p27,p28,p34,p33);
    new Polygon(p28,p29,p35,p34);
    new Polygon(p29,p30,p36,p35);
    
    
    // playground polygon
    var bottomLeft = new Point(50.979095, 11.329417042320804);
    var topLeft = new Point(50.979576, 11.329321459419079);
    var topRight = new Point(50.97962, 11.330130070110913);
    var bottomRight = new Point(50.979084, 11.330274183632254);
    
    playgroundPolygon.points = [bottomLeft,topLeft,topRight,bottomRight];
    
}

initPlayground();




module.exports = {
    polygons: polygons,
    playgroundPolygon: playgroundPolygon
};




// Mercator
// http://wiki.openstreetmap.org/wiki/Mercator
function getMercX(lon) { // 11,3
    var r_major = 6378137.000;
    return r_major * ( lon * (Math.PI/180.0) );
}
function getMercY(lat) { // 50,9
	if (lat > 89.5) {
        lat = 89.5;
    }
    if (lat < -89.5) {
		lat = -89.5;
	}
    var r_major = 6378137.000;
    var r_minor = 6356752.3142;
    var temp = r_minor / r_major;
    var es = 1.0 - (temp * temp);
    var eccent = Math.sqrt(es);
    var phi = lat * (Math.PI/180.0);
    var sinphi = Math.sin(phi);
    var con = eccent * sinphi;
    var com = 0.5 * eccent;
    con = Math.pow((1.0-con)/(1.0+con), com);
    var ts = Math.tan(0.5 * (Math.PI*0.5 - phi))/con;
    var y = 0 - r_major * Math.log(ts);
    return y;	
}
