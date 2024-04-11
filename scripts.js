var mon1 = [];
var mon2 = [];
var target = [];



function getProbability(mon1,mon2, target) {
  var IVInheritNum = 3;
  var success = 1.0;
  var step = 0;
  
  for(var [i] of target.entries()) {
    if (!target[i]) { continue; }
    
    var s = 1.0;
    
    for (var j = step; j < step + 3; j++) {
      if( !((5-j) <= 0) ) { // TODO: bad logic i think :/
        s *= (5-j) / (6-j); // prob of getting any parent IV for current target
      }
    }
    
    var y = (mon1[i] + mon2[i]) / 2 // prob of landing a good parent
    
    var x = s * (1 - y) // prob of forcing override with bad parent
    
    var r = 1/32 * (1 - x) // prob of getting good child IV
    
    s *= y // prob of getting good parent IV
    
    s = r + s - (r * s) // union of getting good IV
    
    success *= s // intersect with other targets
    
    step+=1
    
  }
  
  return success;
}






function bruteforce(mon1, mon2, target, trials) {
  mon1 = mon1.map(value => value ? 31 : 0); // convert bools to stats
  mon2 = mon2.map(value => value ? 31 : 0);
  var IVInheritNum = 3;
  var successes = 0;
  
  for (var i = 0; i < trials; i++) {
    
    var child = [0,0,0,0,0,0].map(function() {  // generate initial random child stats
      return Math.floor(Math.random() * 32);
    });
    
    var stats = [0,1,2,3,4,5];  // choose X random parent stats (usually 3)
    for(var j = 0; j < IVInheritNum; j++) {
      var toRemove = Math.floor(Math.random() * (6-j));
      stats.splice(toRemove, 1);
    }
    
    stats.forEach(function(stat) {
      
      var parent = Math.floor(Math.random() * 2)? mon1 : mon2; // choose which parent to inherit from
      child[stat] = parent[stat]; // inherit random stat from chosen parent
      
    });
    
    
    var fail = [0,1,2,3,4,5].some(function(_, j) {
      return target[j] && (child[j] != 31); // check stat if target
    });
    
    
    if(!fail) successes += 1; // increment once if all targets met
  }
  
  return successes;
}






function calc() {
  var p1 = mon1.map(function(c) { return c.checked; });
  var p2 = mon2.map(function(c) { return c.checked; });
  var t = target.map(function(c) { return c.checked; });
  
  var prob = "p:" + (getProbability(p1,p2,t) * 100).toFixed(3) + "%";
  var bf = "b:" + (bruteforce(p1,p2,t,100000) / 100000 * 100).toFixed(3)  + "%";
  
  var resultTextArea = document.getElementById("result");
  resultTextArea.innerHTML = "<p style='color: red;'>" + prob + "</p>";
  resultTextArea.innerHTML += "<p style='color: blue;'>" + bf + "</p>";
}





document.addEventListener("DOMContentLoaded", function() {
  
  function addCheckboxes(rowName, array) {
    var row = document.getElementById(rowName);
    
    var rowText = document.createElement("th");
    rowText.textContent = rowName;
    rowText.id = "text";
    
    row.appendChild(rowText);
    
    for (var i = 0; i < 6; i++) {
      var boxContainer = document.createElement("td");
      
      var checkbox = document.createElement("input");
      checkbox.value = rowName + " - Option " + (i + 1);
      checkbox.type = "checkbox";
      
      array.push(checkbox);
      boxContainer.appendChild(checkbox);
      row.appendChild(boxContainer);
    }
  }
  
  
  addCheckboxes("Parent A", mon1);
  addCheckboxes("Parent B", mon2);
  addCheckboxes("Target", target);
});






