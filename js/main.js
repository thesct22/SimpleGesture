var doeshav = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.accelerometer');
var doeshav1 = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.gravity');
console.log(doeshav+" "+doeshav1);
var accelerationSensor = tizen.sensorservice.getDefaultSensor("ACCELERATION");
console.log("started");
var prevx=0;
var prevy=0;
var prevz=0;
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
  accelerationSensor.getAccelerationSensorData(onAccGetSuccessCB, onerrorCB);

}

function onAccchangedCB(sensorData) {
//    console.log('Accelerometer sensor data: ');
//    console.log("x: " + sensorData.x);
//    console.log("y: " + sensorData.y);
//   console.log("z: " + sensorData.z);
    var curx=sensorData.x.toFixed(2);
    var cury=sensorData.y.toFixed(2);
    var curz=sensorData.z.toFixed(2);
    if((curx<3&& curx>-3) && (cury<3&& cury>-3) && prevz>5 && curz<-14){
    	console.log("Volume down");
    	document.getElementById('action').innerHTML ="Volume Down";
    }
    else if((curx<3&& curx>-3) && (cury<3&& cury>-3) && prevz<-16 && curz<-18)
    {
    	console.log("Volume up");
    	document.getElementById('action').innerHTML ="Volume Up";
    }
    else if((curx<3&& curx>-3) && (cury>5) && curz<-12)
    {
    	console.log("Previous Channel");
    	document.getElementById('action').innerHTML ="Previous Channel";
    }
    else if((curx<3&& curx>-3) && (cury<-5) && curz<-12)
    {
    	console.log("Next Channel");
    	document.getElementById('action').innerHTML ="Next Channel";
    }
    document.getElementById('xdat').innerHTML = "x: "+ curx;
    document.getElementById('ydat').innerHTML = "y: "+ cury;
    document.getElementById('zdat').innerHTML = "z: "+ curz;
    prevx=curx;
    prevy=cury;
    prevz=curz;
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
