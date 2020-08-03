var doeshav = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.accelerometer');
var doeshav1 = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.gravity');
console.log(doeshav+" "+doeshav1);
var accelerationSensor = tizen.sensorservice.getDefaultSensor("ACCELERATION");
console.log("started");
var prevx=0;
var prevy=0;
var prevz=0;
function onsuccess(dir){
    console.log(JSON.stringify(dir));
}

function onerror(e){
	console.log("error"+e.message);
}

function onsuccessPermission(){
	console.log("Success");
	tizen.filesystem.resolve("/mnt/logfiles/log.txt", onsuccess, onerror, "rw");
}

function onErrorPermission(e){
	console.log("error "+ JSON.stringify(e));
}

function onAccGetSuccessCB(sensorData)
{
  console.log("######## Get acceleration sensor data ########");
  //console.log("x: " + sensorData.x);
  //console.log("y: " + sensorData.y);
  //console.log("z: " + sensorData.z);
  prevx=sensorData.x.toFixed(2);
  prevy=sensorData.y.toFixed(2);
  prevz=sensorData.z.toFixed(2);
  document.getElementById("xdat").innerHTML = "x: "+ prevx;
  document.getElementById("ydat").innerHTML = "y: "+ prevy;
  document.getElementById("zdat").innerHTML = "z: "+ prevz;
}


function onerrorCB(error)
{
  console.log("Error occurred: " + error.message);
}

function onAccsuccessCB()
{
  console.log("Acceleration sensor start");
  tizen.ppm.requestPermission("http://tizen.org/privilege/mediastorage", onsuccessPermission, onErrorPermission);
  accelerationSensor.getAccelerationSensorData(onAccGetSuccessCB, onerrorCB);
}

function onAccchangedCB(sensorData) {
//    console.log('Accelerometer sensor data: ');
//    console.log("x: " + sensorData.x);
//    console.log("y: " + sensorData.y);
	console.log("z: " + sensorData.z);
    var curx=sensorData.x.toFixed(2);
    var cury=sensorData.y.toFixed(2);
    var curz=sensorData.z.toFixed(2);
    var tmstp=new Date().getTime();
    var gstr= " ";
    
    if((curx<3&& curx>-3) && (cury<3&& cury>-3) && prevz>5 && curz<-14){
    	console.log("Down");
    	document.getElementById('action').innerHTML ="Down";
    	gstr="Down";
    }
    else if((curx<3&& curx>-3) && (cury<3&& cury>-3) && prevz<-16 && curz<-18)
    {
    	console.log("Up");
    	document.getElementById('action').innerHTML ="Up";
    	gstr="Up";
    }
    else if((curx<3&& curx>-3) && (cury>5) && curz<-12)
    {
    	console.log("Left");
    	document.getElementById('action').innerHTML ="Left";
    	gstr="Left";
    }
    else if((curx<3&& curx>-3) && (cury<-5) && curz<-12)
    {
    	console.log("Right");
    	document.getElementById('action').innerHTML ="Right";
    	gstr="Right";
    }
    document.getElementById('xdat').innerHTML = "x: "+ curx;
    document.getElementById('ydat').innerHTML = "y: "+ cury;
    document.getElementById('zdat').innerHTML = "z: "+ curz;
    prevx=curx;
    prevy=cury;
    prevz=curz;
    tizen.filesystem.resolve("documents", function(dir) {
  	  var file = dir.resolve("logfile.txt");
  	  console.log(JSON.stringify(file));
  	  file.openStream(
  		         "a",
  		         function(fs) {
  		           fs.write(curx+","+cury+","+curz+","+tmstp+","+gstr+";");
  		           fs.close();
  		         }, function(e) {
  		           console.log("Error " + e.message);
  		         }, "UTF-8"
  		     );
    }, onerror, "rw");
}

window.onload = function () {
	console.log("windows onloaded");
	 accelerationSensor.setChangeListener(onAccchangedCB,200 , 0);
	 accelerationSensor.start(onAccsuccessCB);
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back"){
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    }});
};
