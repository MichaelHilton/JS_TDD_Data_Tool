		var TDDCycles = [];
		var filename;
		var fileNames = {};

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

		function findLastTextChange(Idx){
			while(Idx < allJSONData.length && allJSONData[Idx].eventType === "textChange"){
				 Idx++;
			}
			return Idx-1;
		}

		function shiftStartLeft(){
			// console.log("shiftStartLeft");
			var prevTextChange = findPreviousTextChange(selectionStart);
			if(prevTextChange != selectionStart){
				$('#'+selectionRow+" "+"#"+prevTextChange).addClass("firstSelection");
				$('#'+selectionRow+" "+"#"+selectionStart).removeClass("firstSelection").addClass("midSelection");
				selectionStart = prevTextChange;
				$("#a").empty().text(allJSONData[selectionStart].currText);
				changed();
				addRightClickHandeler('#'+selectionRow+" "+"#"+prevTextChange);
			}
		}

		function shiftStartRight(){
			// console.log("shiftStartRight");
			var nextTextChange = findNextTextChange(selectionStart);
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
			addRightClickHandeler('#'+selectionRow+" "+"#"+nextTextChange);
		}

		function eventClickHandler(Idx,element){
			//Handle Text Changes
			if(allJSONData[Idx].eventType === "textChange"){
				var first = findFirstTextChange(Idx);
				var last = findLastTextChange(Idx);
				createSelection(first,last,element);
				$("#a").empty().text(allJSONData[first].currText);
				$("#b").empty().text(allJSONData[last].currText);
			}else{
				$("#a").empty().text(JSON.stringify(allJSONData[Idx]));
			}
			changed();
		}

		function createCycle(key, options){
			// console.log(selectionStart);
			// console.log(selectionEnd);
			currStart = selectionStart;
			currEnd = selectionEnd;
			if(key === "Test"){
				TDDCycles.push({"id":currStart+currEnd,"CycleType":"red","CycleStart":currStart,"CycleEnd":currEnd});
			}else if(key === "Code"){
				TDDCycles.push({"id":currStart+currEnd,"CycleType":"green","CycleStart":currStart,"CycleEnd":currEnd});
			}else if(key === "Refactor"){
				TDDCycles.push({"id":currStart+currEnd,"CycleType":"blue","CycleStart":currStart,"CycleEnd":currEnd});
			}

			for (var i=Number(currStart);i<=Number(currEnd);i++)
			{
			    //$('#TDD'+i).css( "background-color", "#990000");
			    if(key === "Test"){
					$('#TDD'+i).addClass(currStart+currEnd+ " REDCYCLE");
				}else if(key === "Code"){
					$('#TDD'+i).addClass(currStart+currEnd+ " GREENCYCLE");
				}else if(key === "Refactor"){
					$('#TDD'+i).addClass(currStart+currEnd+ " BLUECYCLE");
				}

			    
			    $('#TDD'+i).unbind();
			    $.contextMenu({
			    	selector: '#TDD'+i, 
			    	callback: TDDCallback,
			    	items: {
			    		"writingTests": {name: "Tests", icon: "tests"},
			    		"writingCode": {name: "Code", icon: "code"},
			    		"refactoring": {name: "Refactor", icon: "refactor"},
			    		"delete": {name: "Delete", icon: "delete"}
			    	}
			    });
			}
		}

		function addRightClickHandeler(elem){
		$.contextMenu({
			    	selector: elem, 
			    	callback: createCycle,
			    	items: {
			    		"Test": {name: "TestCycle", icon: "cycle"},
			    		"Code": {name: "CodeCycle", icon: "cycle"},
			    		"Refactor": {name: "RefactorCycle", icon: "cycle"}
			    	}
			    });
		}

		function createSelection(first,last,element){
			selectionStart = first;
			selectionEnd = last;
			selectionRow = element.parentElement.id;
			$( "div" ).removeClass( "firstSelection midSelection lastSelection");
			$('#'+selectionRow+" "+"#"+first).addClass("firstSelection");
			$('#'+selectionRow+" "+"#"+last).addClass("lastSelection");
			addRightClickHandeler('#'+selectionRow+" "+"#"+first);
			addRightClickHandeler('#'+selectionRow+" "+"#"+last);
			for (var i=Number(first+1);i<=Number(last-1);i++)
			{
				$('#'+selectionRow+" "+"#"+i).addClass("midSelection");
				addRightClickHandeler('#'+selectionRow+" "+"#"+i);
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



	function addColorandListeners(){
		TDDCycles.forEach(function(entry) {
			var currCycle;
			if(entry.CycleType === 'red'){
				currCycle = "REDCYCLE";
			}else if(entry.CycleType === 'green'){
				currCycle = "GREENCYCLE";
			}else if(entry.CycleType === 'blue'){
				currCycle = "BLUECYCLE";
			}
			for (var i=Number(entry.CycleStart);i<=Number(entry.CycleEnd);i++){
				$('#TDD'+i).addClass(currCycle+" "+entry.CycleStart+entry.CycleEnd);
				$.contextMenu({
					selector: '#TDD'+i, 
					callback: TDDCallback,
					items: {
						"writingTests": {name: "Tests", icon: "tests"},
						"writingCode": {name: "Code", icon: "code"},
						"refactoring": {name: "Refactor", icon: "refactor"},
						"delete": {name: "Delete", icon: "delete"}
					}
				});
			}
		});
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


  function loadCyclesFromServer(){
	  	$.ajax({
	  		url: 'ajax/Cycles_'+filename,
	  		dataType: 'json',
	  		success: function( data ) {
	  			if(data === null){
	  				console.log("No TDD Cycles saved");
	  			}else{
			  		TDDCycles = data;
			 	  	console.log(TDDCycles);
			   		addColorandListeners();
			   	}
			},
		});
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

  		$.each( allJSONData, function( key, val ) {
  			addEvent(val,key);
  		});
  		//addListeners();
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
