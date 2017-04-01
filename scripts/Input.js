// Process input object
// params: x position, y position, input name
function Input(x, y, name) {
    this.label = createSpan(name).position(x, y+5);
    this.burstTime = createInput().size(90,20).position(x+40, y);
    this.priority = createInput().size(70,20).position(x+140, y);

    this.delete = function() {
        this.label.remove();
        this.burstTime.remove();
        this.priority.remove();
    }
}