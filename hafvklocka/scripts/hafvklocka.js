//------------------------------------------------------------------------------------

//------------------------------ K A L I B R E R I N G -------------------------------

//------------------------------------------------------------------------------------

var threshold = 0;
var seconds_passed = 1;
var currently_calibrating = false;
var safety_margin = 2;
var loop_var;



function startCalibration(){
    
    var seconds_passed = 0;
    
    document.getElementById("modal_text").innerHTML = "Backa bort från mobilen och se till så att inget rör bordet...";
    
    document.getElementById("btn_field").innerHTML = "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\" onclick=\"resetCalibration();\">Avbryt</button>";
    
    //Denna funktion loopas varje sekund
    function secondCounter() {
        seconds_passed ++;
        
        console.log(seconds_passed);
        
        // ---- ---- Vänta två sekunder så att användaren hinner gå från bordet
        if (seconds_passed == 3){
            console.log("3 sekunder");
            
            //Starta kalibrering
            //Detta gör så att azmax börjar spelas in nere under window.ondevicemotion ------------------- Notera att det är först här axmax börjar spelas in, och då skrivs modalen ut. 
            currently_calibrating = true;
            azmax = 0;
            document.getElementById("modal_text").innerHTML = "Kalibrerar <br> Max movement: " + azmax;
        }
        
        
        // ---- ---- Ytterligare sex sekunder senare
        // Avsluta och ställ in värden
        if (seconds_passed > 8){
            console.log("9 sekunder");
            
            //När azmax har spelats in i 7 sekunder, sätt den till threshold (occh lägg på marginal)
            threshold = (azmax * safety_margin);
            
            //Sätt minimigränsen på slidern till threshold
            slider.setAttribute("min", threshold.toString());
            slider.setAttribute("value", threshold.toString());
            slider.setAttribute("step", threshold.toString());
            
            //EXTREMT FULT SÄTT ATT SÄTTA MAX, OCH DET SKALL LÖSAS
            threshold *= 40;
            slider.setAttribute("max", threshold.toString());
            threshold /= 40;
            
            //Skriv ovanför slidern
            output.innerHTML = "Styrka: " + threshold.toString();
            
            //Skriv ut klart!
            document.getElementById("modal_text").innerHTML = "Klart!";
            
            //Lägg in en "Avsluta knapp"
            document.getElementById("btn_field").innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Grymt!</button>'
            
            //Avsluta loop
            clearInterval(loopVar);
            
            //Stäng av klibreringen i window.Ondevicemotion
            currently_calibrating = false;
        }
    }
    
    //Loopa secondCounter varje sekund
    loopVar = setInterval(secondCounter, 1000);
    
}



function resetCalibration(){
    
    console.log("Resetting calibration");
    
    //Återställ rörelsevärdet
    azmax = 0;
    
    //Sluta loopa secondCounter
    clearInterval(loop_var);
    
    //Avsluta kalibreringen
    var currently_calibrating = false;
    
    //Ställ in den ursprungliga HTML:en i Modalen
    document.getElementById("modal_text").innerHTML = "Lägg din mobil (eller dator om du ska va sån) på det bord du ämnar häfva från. Tryck därefter på \"Fortsätt\" och se till att ingen rör bordet under 5 sekunder.";
    document.getElementById("btn_field").innerHTML = "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Stäng fönster</button><button type=\"button\" class=\"btn btn-primary\" onclick=\"startCalibration();\">Fortsätt</button>";
    
    
    
}


//------------------------------------------------------------------------------------

//------------------------- T I M E R F U N K T I O N E R-----------------------------

//------------------------------------------------------------------------------------

var time_cs = 0;
var time_s = 0;
var time_m = 0;

var timer_active = false;
var cooldown_time = 0;

var output_string = "";

var laps = ["00:00:00","00:00:00","00:00:00"];

function resetTimer() {
    time_cs = 0;
    time_s = 0;
    time_m = 0;
    timer_active = false;
    document.getElementById("toggle_btn").innerHTML = "Start";
    
    //Om den nuvarande tiden inte är 00:00:00
    if(!(document.getElementById("timer_text").innerHTML == "00:00:00")){
        //Lägg till nuvarande tid i som lap
        addLap(document.getElementById("timer_text").innerHTML);
    }
    
    document.getElementById("timer_text").innerHTML = "00:00:00";
}

function toggleTimer() {
    
    //Om cooldown tiden inte har gått ner ännu
    if(cooldown_time > 0){
        return;
    }
    
    //Aktivera eller avaktivera timern
    timer_active = !timer_active;
    
    //Ändra HTML-texten
    if(document.getElementById("toggle_btn").innerHTML == "Start"){
        document.getElementById("toggle_btn").innerHTML = "Pause";
    }else{
        document.getElementById("toggle_btn").innerHTML = "Start";
    }
    
    //Sätt en cooldown
    cooldown_time = 100;
    
}

function timerLoop() {
    
    //Räkna ner cooldown time, om det behövs
    if(cooldown_time > 0){
        cooldown_time --;
    }
    
    
    //Om timern är igång
    if (timer_active){
            time_cs ++;
    
        //Centisekunder till sekunder
        if(time_cs == 100){
            time_cs = 0;
            time_s ++;
        }

        //Sekunder till minuter
        if(time_s == 60){
            time_s = 0;
            time_m ++;
        }
        
        //      ------      Skriv ut tiden      ------      //
        
        //Lägg på nolla om de behövs
        
        
        document.getElementById("timer_text").innerHTML = addZero(time_m) + ":" + addZero(time_s) + ":" + addZero(time_cs);
    }
    
}

function addZero(time){
    if(time < 10){
        return "0" + time;
    }else{
        return time.toString();
    }
}

function addLap(time){
    //Förskjut hela arrayen ett steg åt vänster
    //Börja loopen längst åt höger och gå fram till början
    for(i = (laps.length - 1); i > 0; i--){
        laps[i] = laps[i - 1];
    }
    //Nu är första objektet duplicerat, så vi skriver över det första med vårt nya värde
    laps[0] = time;
    
    document.getElementById("lap1").innerHTML = laps[0];
    document.getElementById("lap2").innerHTML = laps[1];
    document.getElementById("lap3").innerHTML = laps[2];
} 

// Exekverar timerLoop vaje centisekund (0.01) 
var intervalID = window.setInterval(timerLoop, 10);





//------------------------------------------------------------------------------------

//--------------------------- A C C F U N K T I O N E R-------------------------------

//------------------------------------------------------------------------------------

var axmax = 0;
var aymax = 0;
var azmax = 0;

var slider = document.getElementById("force_slider");
var output = document.getElementById("demo");
output.innerHTML =  "Styrka: " + slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
output.innerHTML = "Styrka: " + this.value;
}

//Om enheten har ett motionEvent (alltså om det har ett gyroskop eller accelerometer)
if (window.DeviceMotionEvent != undefined) {
	console.log("Enheten har accelerometer");
	
	//När en ny rörelse upptäcks
	window.ondevicemotion = function(e) {
	
        //Om rörelsen är större än värdet på slidern.
        if(e.acceleration.z > slider.value){
			toggleTimer();
		}
        
        
        if(currently_calibrating && e.acceleration.z > azmax){
			azmax = e.acceleration.z;
            //document.getElementById("modal_text").innerHTML = "Kalibrerar..."
            document.getElementById("modal_text").innerHTML = "Kalibrerar <br> Max movement: " + azmax;
			//document.getElementById("outputz").innerHTML = "Max z: " + azmax;
		}
        
        
		//Om den nya rörelsen va större än någon innan
        /*
		if(e.acceleration.x > axmax){
			axmax = e.acceleration.x;
			document.getElementById("outputx").innerHTML = "Max x: " + axmax;
		}
		if(e.acceleration.y > aymax){
			aymax = e.acceleration.y;
			document.getElementById("outputy").innerHTML = "Max y: " + aymax;
		}
        */
		
	}
}else{
    console.log("Enheten saknar accelerometer");
}