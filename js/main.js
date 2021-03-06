// Global variables
var canvas;
var context;
// How many processes there are
var processCount = 2;
var fps = 50;
// Burst time in seconds
var burstUnitTime = 1000;
// padding for canvas
var padding = 10;
var isAnimationRunning = false;
var stopAnimation = false;

// Burst time sum for all processes
var totalTime;
// Average waiting time
var averageTime;
var processes = [];
// Processes after algorithm
var newProcesses = [];
// X positon for current process
var procXPos;
var currProcIndex;
var procWidth;
// Time units per one time lane tick
var unitsPerTick;
// One unit width in pixels
var unitX;
var currTime;
var lastProcFinishTime;

$(document).ready(function() {
    // Gets canvas
    canvas = document.getElementById("canvas");
    // Gets context
    context = canvas.getContext('2d');

    $("#start").click(function() {
		if(isAnimationRunning){
			// Stop previous animation
			stopAnimation = true;
		}
		
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        resetGlobals();

        if (validationPassed()) {
            // init processes
            $('#processes > tbody > tr').each(function() {
                $this = $(this);
				// Get name
                var name = $this.find("td[name='name']").html();
				// Get time
                var time = parseInt($this.find("input[name='Burst time']").val());
				// Get priority
                var priority = parseInt($this.find("input[name='Priority']").val());

                var isBg = $this.find("input[name='IsBackground']").is(":checked") ? 1 : 0;
                processes.push({
                    time: time,
                    priority: priority,
                    name: name,
                    isBg: isBg,
                    color: "#" + Math.floor(Math.random()*16777215).toString(16)
                });
            });

            var algorithm = parseInt($('#algorithm').val());

            // Calculate total time
            for (var i = 0; i < processes.length; i++) {
                var deltaToTotalTime;

                if(algorithm == 2) // rr - paskaidrojums: lūdzu izlasit komentāru pirms rr funkcijas
                    deltaToTotalTime = 1;
                else if(algorithm == 4 && processes[i].isBg == 0) // multivelel demonstrēs vienu schedulēšanas iterāciju
                     deltaToTotalTime = 1;                   // šim nav iespējams realizēt full rr analogu pēc būtības, jo tas parāda vienu iterāciju
                else
                    deltaToTotalTime = processes[i].time;

                totalTime += deltaToTotalTime;
            }

            drawTimeLine(totalTime);

            switch (algorithm) {
                case 0:
                    fcfs();
                    break;
                case 1:
                    sjn();
                    break;
                case 2:
                    rr();
                    break;
                case 3:
                    priority();
                    break;
                case 4:
                    multilevel();
                    break;
                case 5:
                    fullrr();
                    break;
            }
        }

    });

    $("#add_row").click(function() {
        $('#processes').append('<tr id="p' + processCount + '"></tr>');
        $('#p' + processCount).html("<td name='name'>P" + (processCount + 1) + "</td>" +
            "<td><input type='text' name='Burst time' class='form-control input-md' value='1' /></td>" +
            "<td><input type='number' name='Priority' class='form-control input-md' value='1'/></td>" +
            "<td><div class='checkboxCol'><input type='checkbox' name='IsBackground' class='form-control fixedWidthCheckbox' value='0'/></div></td>");
        processCount++;
    });
    $("#delete_row").click(function() {
        if (processCount > 1) {
            $("#p" + (processCount - 1)).remove();
            processCount--;
        }
    });

    $("#curr_time").html("Current time: 0 s");
    $("#avg_time").html("Average waiting time: -");
});

// Validated the fields
function validationPassed() {
    var validationPassed = true;
    $('#processes > tbody > tr').each(function() {
        if($(this).find("input[name='Burst time']").val() == 0 || $(this).find("input[name='Priority']").val() == 0) {
            validationPassed = false;
            return 0;
        }
    });
    if (!validationPassed) {
        alert("Fill all the fields");
    }
    return validationPassed;
}

function drawTimeLine(totalTime) {
    var centerY = 10;
    var tickSize = 10;
    var lineWidth = canvas.width - 2 * padding;

    // Calculate  units per tick
    while (totalTime / unitsPerTick * unitX > lineWidth) {
        unitsPerTick++;
    }

    context.save();
    context.beginPath();
    context.moveTo(padding, centerY);
    context.lineTo(padding + lineWidth, centerY);
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    unitX = lineWidth / (totalTime / unitsPerTick);
    var xPos, unit;
    context.fillStyle = 'black';
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // draw tick marks
    xPos = padding;
    unit = 0;

    while (xPos < canvas.width - padding) {
        context.moveTo(xPos, centerY - tickSize / 2);
        context.lineTo(xPos, centerY + tickSize / 2);
        context.stroke();
        context.fillText(unit, xPos, centerY + tickSize / 2 + 3);
        unit += unitsPerTick;
        xPos = Math.round(xPos + unitX);
    }

    if(totalTime == unit) {
        context.moveTo(canvas.width - padding, centerY - tickSize / 2);
        context.lineTo(canvas.width - padding, centerY + tickSize / 2);
        context.stroke();
        context.fillText(unit, canvas.width - padding, centerY + tickSize / 2 + 3);
    }

    context.restore();
}

// First come first served algorithm
function fcfs() {
    newProcesses = processes;
    drawNewProcesses();
    averageTime = avg_wait_time();
}

// Shortest job next
function sjn() {
    newProcesses = processes.sort(function(a,b) {
        return a.time - b.time;
    }).map(function(elem, index, arr) {
        return elem;
    });
    drawNewProcesses();
    averageTime = avg_wait_time();
}

// Round robin
//Each process gets a small unit of CPU time (time quantum q), usually 10-100 milliseconds.
//After this time has elapsed, the process is preempted and added to the end of the ready queue.
// mums laika kvants būs 1, jo tas garantē, ka nebūs gļuki, jo procesa min burst time ir 1
// elem.time tiek resetots reset funkcijā, tādēļ to šeit drīkst mainīt
function rr() {
    newProcesses = processes.map(function(elem, index, arr) {
        elem.time = 1;
        return elem;
    });
    drawNewProcesses();
    averageTime = avg_wait_time();
}

// Priority
function priority() {
    newProcesses = processes.sort(function(a,b) {
        return a.priority > b.priority;
    }).map(function(elem, index, arr) {
        return elem;
    });
    drawNewProcesses();
    averageTime = avg_wait_time();
}

// Multilevel description:
//Ready queue is partitioned into separate queues, eg:
//foreground (interactive)
//background (batch)
//Process permanently in a given queue
//Each queue has its own scheduling algorithm:
//foreground – RR
//background – FCFS
//Scheduling must be done between the queues:
//Fixed priority scheduling; (i.e., serve all from foreground then from background).  Possibility of starvation.
function multilevel() {
    newProcesses = processes.sort(function(a,b) {
       return a.isBg > b.isBg;
    }).map(function(elem, index, arr) {
        if(elem.isBg == 0)
            elem.time = 1;
        return elem;
    });
    drawNewProcesses();
    averageTime = avg_wait_time();
}

function fullrr() {
    newProcesses = [];

    for(var i = 0; !processes.every(function(p) {return p.time == 0}); i++, i %= processes.length) {

        if(processes[i].time > 0) {
            isAnyLeft = true;
            var clonedProc = Object.assign({}, processes[i]);
            clonedProc.time = 1;
            processes[i].time--;
            newProcesses.push(clonedProc);
        }
    }

    drawNewProcesses();
    averageTime = avg_wait_time();
}

function avg_wait_time() {
    var avgWaitTime = 0;
    for (var i = 0; i < (newProcesses.length - 1); i++) {
        avgWaitTime += newProcesses[i].time;
    }
    return avgWaitTime / newProcesses.length;
}

function resetGlobals() {
    processes = [];
    newProcesses = [];
    totalTime = 0;
    averageTime = 0;
    processXPos = padding;
    currProcIndex = 0;
    procWidth = 0;
    unitsPerTick = 1;
    unitX = 25;
    currTime = 0;
    lastProcFinishTime = 0;
    $("#avg_time").html("Average waiting time: -");
}

function drawNewProcesses() {

    context.font = "16px Arial";
    context.fillStyle = 'black';
    context.fillText(newProcesses[0].name, processXPos, 170);
    var color = newProcesses[0].color;
    //var color = "#" + Math.floor(Math.random()*16777215).toString(16); 

    function animationLoop() {
		isAnimationRunning = true;
        currProc = newProcesses[currProcIndex];

        if ((currTime / burstUnitTime) - lastProcFinishTime >= currProc.time) {
            // Switch to next process
            lastProcFinishTime += currProc.time;
            processXPos += currProc.time / unitsPerTick * unitX;

            currProc = newProcesses[++currProcIndex];
            color = currProc.color;
            //color = "#" + Math.floor(Math.random()*16777215).toString(16);

            context.font = "16px Arial";
            context.fillStyle = 'black';
            context.fillText(newProcesses[currProcIndex].name, processXPos, 170);
        }

        var rectWidth = (currTime / burstUnitTime / unitsPerTick) * unitX - (lastProcFinishTime / unitsPerTick * unitX);
        context.beginPath();
        context.rect(processXPos, 50, rectWidth, 100);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();

        setTimeout(function() {
            currTime += 1000 / fps;
            $("#curr_time").html("Current time: " + (Math.round(currTime / burstUnitTime * 100) / 100).toFixed(2) + " s");

            if (currTime < totalTime * burstUnitTime) {
				if(stopAnimation){
					stopAnimation = false;
					isAnimationRunning = false;
				} else {
					animationLoop();
				}
            } else {
				isAnimationRunning = false;
                $("#avg_time").html("Average waiting time: " + averageTime.toFixed(2) + " s");
            }
        }, 1000 / fps);
    };
	
	animationLoop();

}

function log(message) {
    console.log(message);
}