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
            $this.drawProcess($this.proceses[i]);
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

    // Draws process in canvas
    this.drawProcess = function(process) {
        fill(this.processColor);
        strokeWeight(2);
        var $this = this; // initialize this as $this so you can access it in setTimout()

        this.currentTimePassed += 1000 * process.burstTime; // Time managment

        setTimeout(function() {
            var newProcess = rect($this.startOfCanvasX, $this.startOfCanvasY, getRectWidth(scale, process), 50);
            $this.elements.push(newProcess);
            $this.elements.push(createElement('h3', 'P' + process.index).position($this.startOfCanvasX + 10, 165));
            $this.startOfCanvasX += (getRectWidth(scale, process) + 3);
            $this.drawTimerMarker(process);
        }, this.currentTimePassed);
    }

    this.drawTimerMarker = function(process) {
        this.timerMark += process.burstTime;
        this.elements.push(createElement('strong', this.timerMark).position(this.startOfCanvasX+5, this.startOfCanvasY+60));
    }

    this.drawAvgTime = function(time) {
        $this.elements.push(createElement("h3", time + " s").position(480,10));
    }

}