var RevealSpotlight = window.RevealSpotlight || (function(){	

	//configs
	var spotlightSize; 
	var toggleOnMouseDown; 
	var presentingCursor;
	var presentingCursorOnlyVisibleWhenSpotlightVisible;
	
	var drawBoard;
	var isSpotlightOn = true;
	var isCursorOn = true;

	function onRevealJsReady(event){
		configure();
		drawBoard = setupCanvas();	

		addWindowResizeListener();

		addMouseMoveListener();

		if(toggleOnMouseDown){
			addMouseToggleSpotlightListener();
			setCursor(false);
		}	

		setSpotlight(false);	
	}

	function configure(){
		var config = Reveal.getConfig().spotlight || {};
		spotlightSize = config.size || 60; 
		presentingCursor = config.presentingCursor || "none"; 

		if(config.hasOwnProperty("toggleSpotlightOnMouseDown")){
			toggleOnMouseDown = config.toggleSpotlightOnMouseDown;
		}else{
			toggleOnMouseDown = true;
		}

		if(config.hasOwnProperty("presentingCursorOnlyVisibleWhenSpotlightVisible")){
			presentingCursorOnlyVisibleWhenSpotlightVisible = config.presentingCursorOnlyVisibleWhenSpotlightVisible;
		}else{
			presentingCursorOnlyVisibleWhenSpotlightVisible = true;
		}
	}

	function setupCanvas() {
		var container = document.createElement('div');
		container.id = "spotlight";
		container.style.cssText ="position:absolute;top:0;left:0;bottom:0;right:0;z-index:99;";

		var canvas = document.createElement('canvas');
		var context = canvas.getContext("2d");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		container.appendChild(canvas);			
		document.body.appendChild(container);
		container.style.display = "none"; 
		return {
			container,
			canvas,
			context
		}	
	}

	function addWindowResizeListener() {
		window.addEventListener('resize', function (e) {
			var canvas = drawBoard.canvas;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}, false);
	}

	function addMouseMoveListener(){		
		drawBoard.canvas.addEventListener('mousemove', function(e) {
		  showSpotlight(e);
		}, false);
	}

	function addMouseToggleSpotlightListener(){
		
		window.addEventListener("mousedown", function(e) { 
			if(!isCursorOn){
				setSpotlight(true);
				if(presentingCursorOnlyVisibleWhenSpotlightVisible){
        			document.body.style.cursor = presentingCursor;
	        	}

				showSpotlight(e);				
			}				
		}, false);

		window.addEventListener("mouseup", function(e) { 
			if(!isCursorOn){
				setSpotlight(false);
				if(presentingCursorOnlyVisibleWhenSpotlightVisible){
        			document.body.style.cursor = "none";
	        	}				
			}
		}, false);		
	}

	function toggleSpotlight(){		
		setSpotlight(!isSpotlightOn);
	}

	function setSpotlight(isOn){
		isSpotlightOn = isOn;
		var container = drawBoard.container;
		if(isOn){
			container.style.display = "block"; 
		}
		else{
			container.style.display = "none"; 
			drawBoard.context.clearRect(0,0,drawBoard.canvas.width, drawBoard.canvas.height);
		}			
	}

	function togglePresentationMode(){		
		setCursor(!isCursorOn);
	}

	function setCursor(isOn){ 
		isCursorOn = isOn;
        if(isOn){
        	document.body.style.userSelect = "auto"; 
            document.body.style.cursor = "default";                      
        }else{

        	document.body.style.userSelect = "none"; 

        	if(presentingCursorOnlyVisibleWhenSpotlightVisible){
        		document.body.style.cursor = "none";
        	}else{
        		document.body.style.cursor = presentingCursor;
        	}        
        }
    }

	function showSpotlight(mouseEvt) {
		var canvas = drawBoard.canvas;
		var context = drawBoard.context;
		var mousePos = getMousePos(canvas, mouseEvt);

        context.clearRect(0,0,canvas.width, canvas.height);
        
        // Create a canvas mask 
        var maskCanvas = document.createElement('canvas');    
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        
        var maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = "#000000A8";
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.globalCompositeOperation = 'xor';
               
        maskCtx.fillStyle = "#FFFFFFFF";
        maskCtx.arc(mousePos.x, mousePos.y, spotlightSize, 0, 2 * Math.PI);
        maskCtx.fill();
        
        context.drawImage(maskCanvas, 0, 0);
     }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x:  evt.clientX - rect.left,
          y:  evt.clientY - rect.top
        };
    }

	Reveal.addEventListener('ready', onRevealJsReady);

	this.toggleSpotlight = toggleSpotlight;
	this.togglePresentationMode = togglePresentationMode;
	return this;
})();