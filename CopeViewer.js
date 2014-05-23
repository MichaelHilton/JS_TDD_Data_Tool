		var TDDCycles = [];
		var TDDPulse = [];
		var filename;
		var fileNames = {};

		function updateTDDCycleStart(index,cycleStart){
 			TDDCycles[index].CycleStart = cycleStart;
 			TDDCycles[index].id = cycleStart+""+TDDCycles[index].CycleEnd;
		}

		function updateTDDCycleEnd(index,cycleEnd){
			TDDCycles[index].CycleEnd = cycleEnd;
			TDDCycles[index].id = TDDCycles[index].CycleStart+""+cycleEnd;
		}

		function findFirstTextChange(Idx){
			while(Idx > 0 && allJSONData[Idx].eventType === "textChange"){
				 Idx--;
			}
			return Idx+1;
		}	

		function findPreviousTextChange(startSelection){
			var i = startSelection-1;
			var currSelection = $('#'+selectionRow+" "+"#"+i);
			while(!currSelection.hasClass("textChange")&& i>0){
				i = i-1;
				currSelection = $('#'+selectionRow+" "+"#"+i);
			}
			if(i <1 ){
				return startSelection;
			}
			return i;
		}	
		function findNextTextChange(startSelection){
			var i = startSelection+1;
			var currSelection = $('#'+selectionRow+" "+"#"+i);
			while(!currSelection.hasClass("textChange") && i<allJSONData.length){
				i = i+1;
				currSelection = $('#'+selectionRow+" "+"#"+i);
			}
			return i;
		}


		function findLeftMostClass(startSelection,className){
			var i = startSelection-1;
			var currSelection = $('#'+selectionRow+" "+"#"+i);
			while(!currSelection.hasClass(className)&& i>0){
				i = i-1;
				currSelection = $('#'+selectionRow+" "+"#"+i);
			}
			if(i <1 ){
				return startSelection;
			}
			return i;
		}	
		function findRightMostClass(startSelection,className){
			var i = startSelection+1;
			var currSelection = $('#'+selectionRow+" "+"#"+i);
			while(!currSelection.hasClass(className) && i<allJSONData.length){
				i = i+1;
				currSelection = $('#'+selectionRow+" "+"#"+i);
			}
			return i;
		}

		function findLastTextChange(Idx){
			while(Idx < allJSONData.length && allJSONData[Idx].eventType === "textChange"){
				 Idx++;
			}
			return Idx-1;
		}

		function shiftStartLeft(){
			// console.log("shiftStartLeft");
			var prevTextChange = findLeftMostClass(selectionStart,"textChange");
			if(prevTextChange != selectionStart){
				$('#'+selectionRow+" "+"#"+prevTextChange).addClass("firstSelection");
				$('#'+selectionRow+" "+"#"+selectionStart).removeClass("firstSelection").addClass("midSelection");
				selectionStart = prevTextChange;
				$("#a").empty().text(allJSONData[selectionStart].currText);
				changed();
				addRightClickHandler('#'+selectionRow+" "+"#"+prevTextChange);
			}
		}

		function shiftStartRight(){
			// console.log("shiftStartRight");
			var nextTextChange = findRightMostClass(selectionStart,"textChange");
			if(nextTextChange <= selectionEnd){
				$('#'+selectionRow+" "+"#"+nextTextChange).addClass("firstSelection");
				$('#'+selectionRow+" "+"#"+selectionStart).removeClass("firstSelection midSelection");
				selectionStart = nextTextChange;
				$("#a").empty().text(allJSONData[selectionStart].currText);
				changed();
				$.contextMenu('destroy','#'+selectionRow+" "+"#"+selectionStart);
			}
		}
		function shiftEndLeft(){
			// console.log("shiftEndLeft");
			var prevTextChange = findPreviousTextChange(selectionEnd);
			if(prevTextChange >= selectionStart){	
				$('#'+selectionRow+" "+"#"+prevTextChange).addClass("lastSelection");
				$('#'+selectionRow+" "+"#"+selectionEnd).removeClass("lastSelection midSelection");
				selectionEnd = prevTextChange;
				$("#b").empty().text(allJSONData[selectionEnd].currText);
				changed();
				$.contextMenu('destroy','#'+selectionRow+" "+"#"+selectionEnd);
			}
		}
		function shiftEndRight(element){
			//console.log("shiftEndRight");
			var nextTextChange = findNextTextChange(selectionEnd);
			$('#'+selectionRow+" "+"#"+nextTextChange).addClass("lastSelection");
			$('#'+selectionRow+" "+"#"+selectionEnd).removeClass("lastSelection").addClass("midSelection");
			selectionEnd = nextTextChange;
			$("#b").empty().text(allJSONData[selectionEnd].currText);
			changed();
			addRightClickHandler('#'+selectionRow+" "+"#"+nextTextChange);
		}


		function shiftCycleStartLeft(index){
			// console.log("ShiftCycleStartLeft");
			var currSpot = Number(TDDCycles[index].CycleStart);
			var nextSpot = currSpot-1;
			
			if(index>0){
				if(nextSpot <= TDDCycles[index-1].CycleEnd){
					return;
				}
			}

			var currCycleType = TDDCycles[index].CycleType;
			var currCycleID = TDDCycles[index].id;

			$('#TDD'+currSpot).removeClass("CycleStartSelection").addClass("CycleMidSelection");

			var currCycleColor ;
			if(currCycleType === "green"){
				currCycleColor = "GREENCYCLE";
			}else if(currCycleType === "red"){
				currCycleColor = "REDCYCLE";
			}else if(currCycleType === "blue"){
				currCycleColor = "BLUECYCLE";
			}

			$('#TDD'+nextSpot).addClass("CycleStartSelection "+ currCycleColor+ " "+ currCycleID);
			$('#TDD'+nextSpot).bind("click",{currIdx:index},selectCycleListener);

			// TDDCycles[index].CycleStart = nextSpot;
			updateTDDCycleStart(index,nextSpot);
			addCycleRightClickHandler("#TDD"+nextSpot);
		}

		function shiftCycleStartRight(index){
			// console.log("shiftCycleStartRight");
			var currSpot = Number(TDDCycles[index].CycleStart);
			var nextSpot = currSpot+1;
			if(nextSpot >= Number(TDDCycles[index].CycleEnd)){
				return;
			}
			$('#TDD'+currSpot).removeClass("CycleStartSelection "+" GREENCYCLE REDCYCLE BLUECYCLE "+ TDDCycles[index].id);
			$('#TDD'+nextSpot).removeClass("CycleMidSelection").addClass("CycleStartSelection");
			$('#TDD'+currSpot).unbind();
			//TDDCycles[index].CycleStart = nextSpot;
			updateTDDCycleStart(index,nextSpot);
			$.contextMenu('destroy','#TDD'+currSpot);

		}
		function shiftCycleEndLeft(index){
			// console.log("shiftCycleEndLeft");
			var currSpot = Number(TDDCycles[index].CycleEnd);
			var nextSpot = currSpot-1;
			if(nextSpot <= Number(TDDCycles[index].CycleStart)){
				return;
			}
			$('#TDD'+currSpot).removeClass("CycleEndSelection "+" GREENCYCLE REDCYCLE BLUECYCLE "+ TDDCycles[index].id);
			$('#TDD'+nextSpot).removeClass("CycleMidSelection").addClass("CycleEndSelection");
			$('#TDD'+currSpot).unbind();
			updateTDDCycleEnd(index,nextSpot);
			// TDDCycles[index].CycleEnd = nextSpot;
			$.contextMenu('destroy','#TDD'+currSpot);
		}
		function shiftCycleEndRight(index){
			// console.log("shiftCycleEndRight");
			var currSpot = Number(TDDCycles[index].CycleEnd);
			var nextSpot = currSpot+1;
			if(index<(TDDCycles.length-1)){
				if(nextSpot >= TDDCycles[index+1].CycleStart){
					return;
				}
			}

			var currCycleType = TDDCycles[index].CycleType;
			var currCycleID = TDDCycles[index].id;

			$('#TDD'+currSpot).removeClass("CycleEndSelection").addClass("CycleMidSelection");

			var currCycleColor ;
			if(currCycleType === "green"){
				currCycleColor = "GREENCYCLE";
			}else if(currCycleType === "red"){
				currCycleColor = "REDCYCLE";
			}else if(currCycleType === "blue"){
				currCycleColor = "BLUECYCLE";
			}

			$('#TDD'+nextSpot).addClass("CycleEndSelection "+ currCycleColor+ " "+ currCycleID);
			$('#TDD'+nextSpot).bind("click",{currIdx:index},selectCycleListener);

			updateTDDCycleEnd(index,nextSpot);
			//TDDCycles[index].CycleEnd = nextSpot;
			addCycleRightClickHandler("#TDD"+nextSpot);

		}

		function eventClickHandler(Idx,element){
			//Handle Text Changes
			if(allJSONData[Idx].eventType === "textChange"){
				$('#eventDiv').css('display','none');
				var first = findFirstTextChange(Idx);
				var last = findLastTextChange(Idx);
				createSelection(first,last,element);
				// $("#a").empty().text(allJSONData[first].currText);
				// $("#b").empty().text(allJSONData[last].currText);
				
				//editor.getSession().setValue("new code here");
				editora.getSession().setValue(allJSONData[first].currText);
				editorb.getSession().setValue(allJSONData[last].currText);


			}else{
			//	$("#a").empty().text(JSON.stringify(allJSONData[Idx]));
			//TODO ADD ELEGENT EVENT HANDELING
			//JSON.stringify(jsonDoc, null, '\t')
			    $('#eventDiv').css('display','block');
				JSONeditor.getSession().setValue(JSON.stringify(allJSONData[Idx], null, '\t'));
			}
			changed();
		}

	function prettyInit(){
	//Handle Text Changes
		var firstTextEvent;
		for(var j = 0; j< allJSONData.length;j++){
			// if(allJSONData[j])
			//console.log(allJSONData[j]);
			if(allJSONData[j].eventType == "textChange"){
				firstTextEvent = j;
				break;
			}
		}
		console.log("j"+j)
		var first = findFirstTextChange(firstTextEvent);
		var last = findLastTextChange(firstTextEvent);
		//createSelection(first,(''));
		editora.getSession().setValue(allJSONData[first].currText);
		editorb.getSession().setValue(allJSONData[last].currText);
		// $("#a").empty().text(allJSONData[first].currText);
		// $("#b").empty().text(allJSONData[last].currText);
		// 	// if(allJSONData[Idx].eventType === "textChange"){
			// 	var first = findFirstTextChange(Idx);
			// 	var last = findLastTextChange(Idx);
			// 	createSelection(first,last,element);
			// 	$("#a").empty().text(allJSONData[first].currText);
			// 	$("#b").empty().text(allJSONData[last].currText);
			// }else{
			// 	$("#a").empty().text(JSON.stringify(allJSONData[Idx]));
			// }
	}
		

		function addRightClickHandler(elem){
		$.contextMenu({
			    	selector: elem, 
			    	callback: createCycle,
			    	items: {
			    		"red": {name: "TestCycle", icon: "cycle"},
			    		"green": {name: "CodeCycle", icon: "cycle"},
			    		"blue": {name: "RefactorCycle", icon: "cycle"}
			    	}
			    });
		}

		function addCycleRightClickHandler(elem){
			$.contextMenu({
					selector: elem, 
					callback: TDDCallback,
					items: {
						"writingTests": {name: "Tests", icon: "tests"},
						"writingCode": {name: "Code", icon: "code"},
						"refactoring": {name: "Refactor", icon: "refactor"},
						"delete": {name: "Delete", icon: "delete"}
					}
				});
		}

		function createSelection(first,last,element){
			selectionStart = first;
			selectionEnd = last;
			selectionRow = element.parentElement.id;
			removeAllSelection();
			
			$('#'+selectionRow+" "+"#"+first).addClass("firstSelection");
			$('#'+selectionRow+" "+"#"+last).addClass("lastSelection");
			addRightClickHandler('#'+selectionRow+" "+"#"+first);
			addRightClickHandler('#'+selectionRow+" "+"#"+last);
			for (var i=Number(first+1);i<=Number(last-1);i++)
			{
				$('#'+selectionRow+" "+"#"+i).addClass("midSelection");
				addRightClickHandler('#'+selectionRow+" "+"#"+i);
			}

			$(document).unbind('keydown');

			$(document).keydown(function(e){
			    if (e.keyCode == 37) { 
			    	if(e.shiftKey){
			    		shiftStartLeft(element);
			    	}else{
			    		shiftEndLeft(element);
			    	}			   
			       return false;
			    }
			    if (e.keyCode == 39) { 
			       if(e.shiftKey){
			    		shiftStartRight(element);
			    	}else{
			    		shiftEndRight(element);
			    	}	
			       return false;
			    }
			});
		}

		function getSafePath(path){
			if(path === undefined){
				return "";
			}
			return path.replace(/\//g, '').replace(/\./g, '');
		}


		function addPlaceHolders(currRow, divClass, idx){
			$.each(fileNames, function( key, val ) {
				if(currRow === key){

				}else{
					if(key === 'TDDCycles'){
						$('#'+getSafePath(key)).append("<div class='" + divClass + "' id=TDD" +idx+ " '></div>");
					}else{
						$('#'+getSafePath(key)).append("<div class='" + divClass + "'></div>");
					}
				}
			});
			$('.spacer').append("<div class='SPACER_" + divClass + "' id=Spacer" +idx+ "></div>");
		}

		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

	function updateTDDCycle(cycleID,cycleType){
		TDDCycles.forEach(function(currCycle){
			if(currCycle.id === cycleID){
				currCycle.CycleType = cycleType;
			}
		});
	}


	function TDDCallback(key, options) {
		var arrOfClasses = this[0].className.split(" ");
		var CycleID ;
		arrOfClasses.forEach(function(entry) {
			if(isNumber(entry)){
				CycleID = entry;
				return;
			}
		});
		if(key === "writingTests"){

			$("."+CycleID).removeClass("GREENCYCLE");
			$("."+CycleID).removeClass("BLUECYCLE");
			$("."+CycleID).addClass("REDCYCLE");
			updateTDDCycle(CycleID,"red");
		}
		if(key === "writingCode"){
			$("."+CycleID).removeClass("REDCYCLE");
			$("."+CycleID).removeClass("BLUECYCLE");
			$("."+CycleID).addClass("GREENCYCLE");
			updateTDDCycle(CycleID,"green");
		}
		if(key === "refactoring"){
			$("."+CycleID).removeClass("GREENCYCLE");
			$("."+CycleID).removeClass("REDCYCLE");
			$("."+CycleID).addClass("BLUECYCLE");
			updateTDDCycle(CycleID,"blue");
		}
		if(key === "delete"){
			removeCycle(this[0].getAttribute('id').substr(3))
		}
	}


	function removeAllSelection(){
		$( "div" ).removeClass( "CycleStartSelection CycleEndSelection CycleMidSelection");
		$( "div" ).removeClass( "firstSelection midSelection lastSelection");
		$(document).unbind('keydown');
	}

	function findCurrPulseLocFromCycle(currID){
		var currPulse;
		for(var i =0; i < TDDPulse.length; i++){
			var currTDDPulse = TDDPulse[i];
			if(currTDDPulse.red.id == currID){
				return i;
			}
			if(currTDDPulse.green.id == currID){
				return i;
			}
			if(currTDDPulse.blue != null){
				if(currTDDPulse.blue.id == currID){
				return i;
				}
			}
		}
	}

	function selectCycleListener(element){
		// console.log(element.data.currIdx);
		var selectedCycleIndex = element.data.currIdx;

		var start = TDDCycles[selectedCycleIndex].CycleStart;
		var end = TDDCycles[selectedCycleIndex].CycleEnd;
		removeAllSelection();

        var currID = TDDCycles[selectedCycleIndex].id;
		//findCurrPulseFromCycle(currID);

		selectPulseinCycles("pulse"+findCurrPulseLocFromCycle(currID));

		$('#TDD'+start).addClass("CycleStartSelection");
		$('#TDD'+end).addClass("CycleEndSelection");
		for (var i=Number(start)+1;i<=Number(end)-1;i++)
		{
			$('#TDD'+i).addClass("CycleMidSelection");
			//addRightClickHandler('#'+selectionRow+" "+"#"+i);
		}

		$(document).keydown(function(e){
		    if (e.keyCode == 37) { 
		    	if(e.shiftKey){
		    		shiftCycleStartLeft(selectedCycleIndex);
		    	}else{
		    		shiftCycleEndLeft(selectedCycleIndex);
		    	}			   
		       return false;
		    }
		    if (e.keyCode == 39) { 
		       if(e.shiftKey){
		    		shiftCycleStartRight(selectedCycleIndex);
		    	}else{
		    		shiftCycleEndRight(selectedCycleIndex);
		    	}	
		       return false;
		    }
		});

	}

	function addNewCycleToTimeLine(TDDCyclesIndex){
	
		var startCycle = TDDCycles[TDDCyclesIndex].CycleStart;
		var endCycle = TDDCycles[TDDCyclesIndex].CycleEnd;
		var cycleType = TDDCycles[TDDCyclesIndex].CycleType;

		var currCycle;
			if(cycleType === 'red'){
				currCycle = "REDCYCLE";
			}else if(cycleType === 'green'){
				currCycle = "GREENCYCLE";
			}else if(cycleType === 'blue'){
				currCycle = "BLUECYCLE";
			}

		for (var i=Number(startCycle);i<=Number(endCycle);i++){
				//add correct class
				$('#TDD'+i).addClass(currCycle+" "+startCycle+endCycle);
				//add left click listener
				$('#TDD'+i).bind("click",{currIdx:TDDCyclesIndex,currId:TDDCycles[TDDCyclesIndex].id},selectCycleListener);
				//add right click listener
				// $.contextMenu({
				// 	selector: '#TDD'+i, 
				// 	callback: TDDCallback,
				// 	items: {
				// 		"writingTests": {name: "Tests", icon: "tests"},
				// 		"writingCode": {name: "Code", icon: "code"},
				// 		"refactoring": {name: "Refactor", icon: "refactor"},
				// 		"delete": {name: "Delete", icon: "delete"}
				// 	}
				// });
				addCycleRightClickHandler('#TDD'+i);
			}
	}


	function addColorandListeners(){
		for(var i = 0; i < TDDCycles.length; i++){
			addNewCycleToTimeLine(i);
		}
		// TDDCycles.forEach(function(entry) {
			
		// 	addNewCycleToTimeLine(entry.CycleStart,entry.CycleEnd,entry.CycleType);
		// });
	}

	function addSortedCycle(currTDDCycle){
		var insertLocation = TDDCycles.length;
		for(var i = 0; i < TDDCycles.length;i++){
			if(currTDDCycle.CycleEnd < TDDCycles[i].CycleStart ){
				insertLocation = i;
				break;
			}
		}
		TDDCycles.splice(insertLocation,0,currTDDCycle);
		return insertLocation;
	}

	function createCycle(key, options){
			var currRange = selectionStart + "" + selectionEnd;
			var currInsertLocation = addSortedCycle({"id":currRange,"CycleType":key,"CycleStart":selectionStart,"CycleEnd":selectionEnd});
			addNewCycleToTimeLine(currInsertLocation);			
		}


	function removeCycle(selectedID){
		//console.log("REMOVE "+selectedID);
		var newLoop = [];
		TDDCycles.forEach(function(entry) {
			//console.log(entry.CycleStart);
			var numCycleStart = Number(entry.CycleStart);
			var numCycleEnd = Number(entry.CycleEnd);
			if(numCycleStart <= selectedID && selectedID <= numCycleEnd){
				for (var i=numCycleStart;i<=numCycleEnd;i++){
		    		$('#TDD'+i).removeClass("REDCYCLE");
		    		$('#TDD'+i).removeClass("BLUECYCLE");
		    		$('#TDD'+i).removeClass("GREENCYCLE");
					$.contextMenu('destroy' ,'#TDD'+i);
				}
			}else{	
				newLoop.push(entry);
			}
		});
		TDDCycles = newLoop;
	}


  //precondition: key refers to event on java file
  function isMiddleJavaTextChangeEvent(key, allJSONData){

  	var currentEvent = allJSONData[key];
  	var previousEvent = allJSONData[key - 1];
  	var nextEvent = allJSONData[key + 1];

  	var isFirstEvent = key === 0;
  	var isLastEvent = key === allJSONData.length - 1;

  	if(currentEvent.eventType != "textChange")
  		return false;

  	if(isFirstEvent || previousEvent.eventType != "textChange")
  		return false;

  	if (isLastEvent || nextEvent.eventType != "textChange")
  		return false;

  	return true;
  }

  function addEventDiv(divId, divClass, eventType, key){
  	$('#'+divId).append("<div class='" + divClass + " " + eventType + "' id='"+key+"' onClick='eventClickHandler(" +key+ ",this)'></div>");
  }

  function addEventDiv(divId, divClass, eventType, key, mouseOver){
  	$('#'+divId).append("<div class='" + divClass + " " + eventType + "' id='"+key+"' onClick='eventClickHandler(" +key+ ",this)' title="+JSON.stringify(mouseOver)+"></div>");
  }

  function addEvent(event,key){
  	if (!(typeof event.entityAddress === "undefined")){ 
  		if(event.entityAddress.indexOf(".java") > -1){

  			if (isMiddleJavaTextChangeEvent(key, allJSONData)) {
  				addEventDiv(getSafePath(event.entityAddress), "smallEventDiv", event.eventType, key);
  				addPlaceHolders(event.entityAddress, "smallPlaceHolder",key);
  			}else{
  				addEventDiv(getSafePath(event.entityAddress), "eventDiv", event.eventType, key);
  				addPlaceHolders(event.entityAddress, "placeHolder",key); 
  			}

  		}else{
  			if(event.eventType === 'testRun'){
  				addEventDiv("events", "eventDiv", event.eventType+"_"+event.testResult, key,event);
  			}else{
  				addEventDiv("events", "eventDiv", event.eventType, key);
  			}
  			addPlaceHolders("events", "placeHolder",key);
  		}
  	}else{
  		addEventDiv("events", "eventDiv", event.eventType, key);
  		addPlaceHolders("events", "placeHolder",key);
  	}


  }



  function findAllFiles(allJSONData){
  	fileNames["TDDCycles"] = 1;
  	$.each( allJSONData, function( key, val ) {
  		if (!(typeof val.entityAddress === "undefined")){ 
  			if(val.entityAddress.indexOf(".java") > -1){
  				fileNames[val.entityAddress] = 1;
  			}else{
  				fileNames["events"] = 1;
  			}
  		}
  	});
  	return(fileNames);
  }

  function stringEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  //given a cycle, construct mappings like file -> [event, ...] for all files touched in the cycle
  function computeSourceFileTextEventMap(cycle){
  	var fileMap = {};

  	if(cycle == null || cycle == undefined)
  		return fileMap;

  	var start = parseInt(cycle.CycleStart);
  	var end = parseInt(cycle.CycleEnd);

  	var sourceTextEvents = allJSONData.slice(start, end + 1).filter(function(anEvent){
  		if (anEvent.eventType != "textChange") 
  			return false;

  		if(!stringEndsWith(anEvent.entityAddress, ".java"))
  			return false;
  		 
  		return true;
  	});

  	sourceTextEvents.forEach(function(anEvent){
  		var file = anEvent.entityAddress;

  		if (!(file in fileMap)) {
  			fileMap[file] = [];
  		}

  		fileMap[file].push(anEvent);
  	});

  	return fileMap;
  }

  function splitInWords(value) {
    return value.split(/(\s+|\b)/g).filter(function(s){ return s.trim() != "" });
  };

  //how many words does firstString differ from secondString
  function getWordDiffSize(firstString, secondString){
  	var diff = JsDiff.diffWords(firstString, secondString);

  	var diffStrings = diff.filter(function(aDiff){
  		return (aDiff.added != undefined) || (aDiff.removed != undefined);
  	})
  	.map(function(aDiff){return aDiff.value});

  	var wordCount = 0;

  	for (i in diffStrings){
  		wordCount += splitInWords(diffStrings[i]).length;
  	}

  	return wordCount;
  }

  //given a cycle, return how many words were changed in it
  function wordChangedMetric(cycle){

  	if (cycle == null || cycle == undefined)
  		return 0;

  	var fileMap = computeSourceFileTextEventMap(cycle);

  	if (Object.keys(fileMap) == 0) {return 0};

  	var fileWordsChanged = Object.keys(fileMap).map(function(file){
  		var firstTextEvent = fileMap[file][0];
  		var lastTextEvent = fileMap[file][fileMap[file].length - 1];

  		return getWordDiffSize(firstTextEvent.currText, lastTextEvent.currText);
  	});

  	return fileWordsChanged.reduce(function(a, b){a + b});
  }

  //given a cycle, return how long it took
  function timestampMetric(cycle){
  	if (cycle == null) {return 0};

  	var startingEvent = allJSONData[cycle.CycleStart];
  	var endingEvent = allJSONData[cycle.CycleEnd];

  	return Math.abs(endingEvent.timestamp - startingEvent.timestamp);
  }

  //map an array of pulses to an array of pulse metrics
  function mapPulseArrayToMetrics(TDDPulse, metricFunction){
  	var metricArray = [];

  	var maxRed = Number.MIN_VALUE;
  	var maxGreen = Number.MIN_VALUE;
  	var maxBlue = Number.MIN_VALUE;

	TDDPulse.forEach(function(pulse){
		if (metricFunction(pulse.red) > maxRed) {maxRed = metricFunction(pulse.red)};
		if (metricFunction(pulse.green) > maxGreen) {maxGreen = metricFunction(pulse.green)};
		if (metricFunction(pulse.blue) > maxBlue) {maxBlue = metricFunction(pulse.blue)};
	});  	

  	TDDPulse.forEach(function(pulse){
  		var redMetric = metricFunction(pulse.red) / maxRed;
  		var greenMetric = metricFunction(pulse.green) / maxGreen;
  		var blueMetric = metricFunction(pulse.blue) / maxBlue;

  		metricArray.push({red : redMetric, green : greenMetric, blue : blueMetric});
  	});

  	return metricArray;
  }

  function buildpulseChart(TDDPulse, metricFunction){
  	var metrics = mapPulseArrayToMetrics(TDDPulse, metricFunction);
	var my_pulsePlot = pulsePlot().width(100).height(100).innerRadius(5).outerRadius(50).click(function(){
		// console.log("CLICK");
		
		selectPulseinCycles(this.parentElement.id);
	});
		//.hover(function(){
	// 	$('.pulseChart').removeClass("hoveredPulsePlot");
	// 	$("#"+this.parentElement.id).addClass("hoveredPulsePlot");
	// });

  	TDDPulse.forEach(function(pulse, index){
  		$('#PulseArea').append("<div class='pulseChart' id='pulse" + index + "'></div>");
		var data = createHiveData(metrics[index].red,metrics[index].green,metrics[index].blue);
  		d3.select("#pulse" + index + "")
		      .datum(data)
		      .call(my_pulsePlot);

  	});
  }

  function selectPulseinCycles(elem){
  	$('.pulseChart').removeClass("clickedPulsePlot");
	$("#"+elem).addClass("clickedPulsePlot");
  	var currPulse = TDDPulse[Number(elem.substr(5))];
  	selectOnePulse(currPulse);
  }

  function selectOnePulse(currPulse){
  	  	$('#TDDCycles').children().removeClass("unselected");  	
  	$('#TDDCycles').children().slice(0,currPulse.red.CycleStart).addClass("unselected");
  	if(currPulse.blue == null){
  		$('#TDDCycles').children().slice((Number(currPulse.green.CycleEnd)+1),$('#TDDCycles').children().length).addClass("unselected");
  	}else{
  		$('#TDDCycles').children().slice((Number(currPulse.blue.CycleEnd)+1),$('#TDDCycles').children().length).addClass("unselected");
  	}
  }

  function createHiveData(red,green,blue){
  	if(blue == 0 || isNaN(blue)){
  		blue = 0.001;
  	}
  	if(red == 0 || isNaN(red)){
  		red = 0.001;
  	}
  	if(green == 0 || isNaN(green)){
  		green = 0.001;
  	}

  	var data = [
		  {source: {x: 0, y0: 0.0, y1: red}, target: {x: 1, y0: 0.0, y1: red}, group:  3},
		  {source: {x: 1, y0: 0.0, y1: green}, target: {x: 2, y0: 0.0, y1: green}, group:  7},
		  {source: {x: 2, y0: 0.0, y1: blue}, target: {x: 0, y0: 0.0, y1: blue}, group: 11}
		];
		return data;
  }

  function loadCyclesFromServer(){
	  	$.ajax({
	  		url: 'ajax/Cycles_'+filename,
	  		dataType: 'json',
	  		success: function( data ) {
	  			if(data === null){
	  				//console.log("No TDD Cycles saved");
	  			}else{
			  		TDDCycles = data;
			 	  	//console.log(TDDCycles);
			   		addColorandListeners();

			   		TDDPulse = buildTDDPulse(TDDCycles);
			   		groupCycles(TDDPulse);
			   		buildpulseChart(TDDPulse, timestampMetric);
			   	}
			},
		});
  	}

  	function groupCycles(TDDPulse){
  		TDDPulse.forEach(function(currPulse){
			// console.log(currPulse);
			$('#TDD'+currPulse.red.CycleStart).addClass("startTDDPulse");
			if(currPulse.blue == null){
				$('#TDD'+currPulse.green.CycleEnd).addClass("endTDDPulse");
			}else{
				$('#TDD'+currPulse.blue.CycleEnd).addClass("endTDDPulse");
			}
		});
  	}


  	function shallowClone(obj){
  		return jQuery.extend({}, obj);
  	}

	function buildTDDPulse(cycles){
		var TDDPulse = [];

		var initState = "init";
		var redState = "red";
		var greenState = "green";
		var currentState = initState;

		var emptyPulsePrototype = {"red" : null, "green" : null, "blue" : null};
		var currentPulse = shallowClone(emptyPulsePrototype);

		function doInitState(cycle){
			if (cycle.CycleType === "red"){
				currentState = redState;
				currentPulse.red = cycle;
			};
			
			return 1;
		}

		function doRedState(cycle){
			if (cycle.CycleType === "green") {
				currentState = greenState;
				currentPulse.green = cycle;
			}else{
				currentState = initState;
			};

			return 1;
		}

		function doGreenState(cycle){
			var advancement;

			if (cycle.CycleType === "blue") {
				currentPulse.blue = cycle;
				advancement = 1;
			} else{
				advancement = 0;
			}

			currentState = initState;

			TDDPulse.push(currentPulse);
			currentPulse = shallowClone(emptyPulsePrototype);

			return advancement;
		}

		var i = 0;
		while(i < cycles.length){
			var currentCycle = cycles[i];
			var advancement = 1;

			if (currentState === initState)
				advancement = doInitState(currentCycle);

			else if (currentState === redState)
				advancement = doRedState(currentCycle);

			else if (currentState === greenState)
				advancement = doGreenState(currentCycle);

			i += advancement;
		}

		if (currentState === greenState) {doGreenState({CycleType : "endCycle"})};

		return TDDPulse;
	}



	function testBuildTDDPulse(){
		var red1 = {CycleType : "red"};
		var green1 = {CycleType : "green"};
		var blue1 = {CycleType : "blue"};

		var red2 = {CycleType : "red"};
		var green2 = {CycleType : "green"};

		var red3 = {CycleType : "red"};
		var green3 = {CycleType : "green"};
		var blue3 = {CycleType : "blue"};


		var cycles = [{CycleType : "blue"}, 
						red1, 
						green1, 
						blue1, 
						{CycleType : "red"}, 
						{CycleType : "red"}, 
						red2, 
						green2, 
						red3, 
						green3, 
						blue3
					];

		var expected = [{"red" : red1, "green" : green1, "blue" : blue1}, {"red" : red2, "green" : green2, "blue" : null}, {"red" : red3, "green" : green3, "blue" : blue3}];

		console.debug(buildTDDPulse(cycles));
	}

 //Read in data of all changes
  $(document).ready(function(){
  	filename = window.location.href.split("?")[1].split("=")[1];
  	$.getJSON("uploads/"+filename, function( data ) {
  		allJSONData = data;
  		var items = [];
  		var fileNames = findAllFiles(allJSONData);
  		// console.log(fileNames);
  		$.each(fileNames, function( key, val ) {
  			$('#allEvents').append("<div class='rowContainer' id='"+key+"Row'><div class='spacer'><div class='rowLabel'>"+key+"</div></div><div class='fileRow' id='" + getSafePath(key) + "' ></div></div>");   
  		});

  		//prettyInit();
  		$.each( allJSONData, function( key, val ) {
  			addEvent(val,key);
  		});

  		loadCyclesFromServer();


  	});
  });




  $(function() {
  	$("button")
  	.button()
  	.click(function( event ) {
  		// console.log("SAVE CYCLES");
  		// console.log(TDDCycles);
  		$.post("ajax/saveAnnotations.php",{ 'TDDCycles': TDDCycles , 'filename':filename},function callback(){
  			$('#saveResult').attr("src","icons/accept.png").show().delay(2000).fadeOut(1000);
  		});
  	});
  });
