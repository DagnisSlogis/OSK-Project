// Global variables
var canvas;
var context;
var processCount = 1;
var fps = 50;
var burstUnitTime = 1000;
var padding = 10;

var totalTime;
var averageTime;
var processes = [];
// Processes after algorithm
var newProcesses = [];
var procXPos;
var currProcIndex;
var procWidth;
var unitsPerTick;
var unitX;
var currTime;
var lastProcFinishTime;

$(document).ready(function() {
    // Gets canvas
    canvas = document.getElementById("canvas");
    // Gets context
    context = canvas.getContext('2d');

    $("#start").click(function() {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        resetGlobals();

        if (validationPassed()) {
            // init processes
            $('#processes > tbody > tr').each(function() {
                $this = $(this);
                var name = $this.find("td[name='name']").html();
                log(name);
                var time = parseInt($this.find("input[name='Burst time']").val());
                var priority = parseInt($this.find("input[name='Priority']").val());
                processes.push({
                    time: time,
                    priority: priority,
                    name: name
                });
            });

            // Calculate total time
            for (var i = 0; i < processes.length; i++) {
                totalTime += processes[i].time;
            }

            drawTimeLine(totalTime);

            var algorithm = parseInt($('#algorithm').val());

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
            }
        }

    });

    $("#add_row").click(function() {
        $('#processes').append('<tr id="p' + processCount + '"></tr>');
        $('#p' + processCount).html("<td name='name'>P" + (processCount + 1) + "</td>" +
            "<td><input type='text' name='Burst time' class='form-control input-md' value='0' /></td>" +
            "<td><input type='number' name='Priority' class='form-control input-md' value='0'/></td>");
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

function fcfs() {
    newProcesses = processes;
    drawNewProcesses();
    averageTime = fcfs_avg_wait()
}

function fcfs_avg_wait() {
    var avgWaitTime = 0;
    for (var i = 0; i < (processes.length - 1); i++) {
        avgWaitTime += processes[i].time;
    }
    return avgWaitTime / processes.length;
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
    var color = "#" + Math.floor(Math.random()*16777215).toString(16); 

    function animationLoop() {
        currProc = newProcesses[currProcIndex];

        if ((currTime / burstUnitTime) - lastProcFinishTime >= currProc.time) {
            // Switch to next process
            lastProcFinishTime += currProc.time;
            processXPos += currProc.time * unitsPerTick * unitX;
            currProc = newProcesses[++currProcIndex];
            color = "#" + Math.floor(Math.random()*16777215).toString(16);

            context.font = "16px Arial";
            context.fillStyle = 'black';
            context.fillText(newProcesses[currProcIndex].name, processXPos, 170);
        }

        var rectWidth = (currTime / burstUnitTime) * unitsPerTick * unitX - (lastProcFinishTime * unitsPerTick * unitX);
        context.beginPath();
        context.rect(processXPos, 50, rectWidth, 100);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();

        setTimeout(function() {
            currTime += 1000 / fps;
            $("#curr_time").html("Current time: " + Math.round(currTime / burstUnitTime * 100) / 100 + " s");

            if (currTime < totalTime * burstUnitTime) {
                animationLoop();
            } else {
                $("#avg_time").html("Average waiting time: " + averageTime + " s");
            }
        }, 1000 / fps);
    };
    animationLoop();
}

function log(message) {
    console.log(message);
}