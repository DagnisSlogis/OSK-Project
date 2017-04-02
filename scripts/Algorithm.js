// Algorithm object
function Algorithm() {
    this.proceses = []; // Holds all the proceses
    this.elements = []; // For easier drawn element managment
    this.startOfCanvasX = 300;
    this.startOfCanvasY = 200;
    this.sizeOfCanvas = 600;
    this.processColor = color(255, 204, 0);
    this.timerMark = 0;
    this.currentTimePassed = 0;

    this.clean = function() {
        if(this.elements.length) {
            for(var i = 0; i < this.elements.length; i++ ) {
                if(this.elements[i].elt){
                    this.elements[i].remove();
                }
                else {
                    this.elements[i].clear();
                }
            }
            this.elements = [];
            this.startOfCanvasX = 300;
            this.startOfCanvasY = 200;
            this.sizeOfCanvas = 600;
            this.timerMark = 0;
            this.currentTimePassed = 0;
			timerHtml.html("Timer: ");
        }
    }

    // First-come First-served algorithm
    this.fcfs = function(proceses) {
        this.proceses = proceses;
        $this = this;
        totalBurtTime = getTotalBurstTime();
        // draw init - 0 marker
        $this.elements.push(createElement('strong', $this.timerMark).position($this.startOfCanvasX+5, $this.startOfCanvasY+60));
        
        scale = $this.sizeOfCanvas / totalBurtTime;

        for (var i = 0; i < $this.proceses.length; i++) {
			setTimeout(function() {
				$this.drawProcess($this.proceses[i]);
			//timerHtml.html("Timer: " + currTimePaasedLocalCopy);
        }, this.currentTimePassed);
        }

        setTimeout(function() {
            $this.drawAvgTime(totalBurtTime / $this.proceses.length);
        }, 1000 * totalBurtTime);
    }

    //** HELPER METHODS **//
    // Get total burtsTime of all proceses
    function getTotalBurstTime() {
        var totalBurtTime = 0;
        this.proceses.forEach(function(process){
            totalBurtTime += process.burstTime;
        });
        return totalBurtTime;
    }

    // Get process rectangle width
    function getRectWidth(scale, process) {
        return scale * process.burstTime;
    }

	var width = 1;
    // Draws process in canvas
    this.drawProcess = function(process) {
        fill(this.processColor);
        strokeWeight(2);
        var $this = this; // initialize this as $this so you can access it in setTimout()
		var startTime = this.currentTimePassed;
        this.currentTimePassed += 1000 * process.burstTime; // Time managment
		var endTime = this.currentTimePassed;
		var currTime = startTime;
		var interval = 100;
	
		var endWidth = getRectWidth(scale, process);
		var steps = 1000 * process.burstTime / interval;
		var widthStep = endWidth / steps;
		var processRect = rect($this.startOfCanvasX, $this.startOfCanvasY, width, 50);
		$this.elements.push(processRect);
		
		var procInterval = setInterval(function () {
			width += widthStep;
			
			currTime += interval;
			console.log(width);
			if(currTime >= endTime){
				clearInterval(procInterval);
				console.log("done");
			}
		}, interval);

    }

    this.drawTimerMarker = function(process) {
        this.timerMark += process.burstTime;
        this.elements.push(createElement('strong', this.timerMark).position(this.startOfCanvasX+5, this.startOfCanvasY+60));
    }

    this.drawAvgTime = function(time) {
        $this.elements.push(createElement("h3", time + " s").position(480,70));
    }

}