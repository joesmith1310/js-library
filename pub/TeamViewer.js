let Frames = [];
let currFrame = 0;

const formations = new Map([
    ['Soccer', [[1,4,4,2], [1,4,3,3], [1,4,5,1], [1,3,4,3]]],
    ['Hockey', [[1,3,2], [1,4,1], [1,2,3]]]
]);

const reducer = (accumulator, curr) => accumulator + curr;

function TeamViewer(viewerId, primary = 'gray', accent = 'red') {
    this.viewerId = viewerId;
    this.formationViews = [];
    this.playerForm = null;
    this.players = [];
    this.theme = primary;
    this.secondaryTheme = accent;
}

TeamViewer.prototype = {

    createFormationViews : function(width = 500, height = 500, sport = 'Soccer', formation = [1,4,4,2], nodeSize = 70, primaryColor = this.theme, accentColor = this.secondaryTheme) {
        let views = document.getElementsByClassName('tv-formation-view');

        for (let i = 0; i < views.length; i++) {
            if (views[i].classList.contains(this.viewerId)) {
                let view = views[i]
                view.style.cssText = `
                width: ${width};
                height: ${height};`;
                let formationView = new FormationView(view, this, width, height, sport, formation, nodeSize, primaryColor, accentColor);
                this.formationViews.push(formationView);
                formationView.init();
            }
        }
    },

    setPrimaryColor : function(color) {
        this.theme = color;
    },

    setAccentColor : function(color) {
        this.secondaryTheme = color;
    },

    getFormationView : function(index) {
        return this.formationViews[index];
    },

    getPlayerForm : function() {
        return this.playerForm;
    },

    createPlayerForm : function(width = 500, theme = this.theme) {
        let forms = document.getElementsByClassName('tv-player-form');
        let form = null;

        for (let i = 0; i < forms.length; i++) {
            if (forms[i].classList.contains(this.viewerId)) {
                form = forms[i];
                let playerForm = new PlayerForm(form, this, width, theme);
                this.playerForm = playerForm;
                playerForm.init();
            }
        }
    },

    addPlayer : function(name, num, pos, com) {
        let player = new Player(name, num, pos, com);
        for (let i = 0; i < this.formationViews.length; i++) {
            let view = this.formationViews[i];
            view.addPlayer(player);
        }
        this.players.push(player);
        for (let i = 0; i < this.players.length; i++) {
        }
    },

    removePlayer : function(player) {
        let playerObject = null;
        if (typeof player == 'number') {
            for (let i = 0; i < this.players.length; i++) {
                if(this.players[i].number == player) {
                    playerObject = this.players[i];
                }
            }
        }
        else {
            playerObject = player;
        }
        let index = this.players.indexOf(playerObject);
        this.players.splice(index, 1);
        for (let i = 0; i < this.formationViews.length; i++) {
            let view = this.formationViews[i];
            view.removePlayer(playerObject);
        }
    }

}

function FormationView(view, teamViewer, width, height, sport, formation, nodeSize, theme, secondaryTheme) {
    this.teamViewer = teamViewer;
    this.sport = sport;
    this.view = view;
    this.theme = theme;
    this.secondaryTheme = secondaryTheme;
    this.subs = new Map();
    this.nodes = new Map();
    this.width = width;
    this.height = height;
    this.formationStyle = formation;
    this.positionMap = new Map();
    this.nodeSize = nodeSize;
    this.draggedPlayer = null;

    this.layers = [];
    this.overlays = []; //Used when loading a frame
    this.activeLayer = 0;
    this.currArrow = [];
    this.isCustomFormation = false;
    this.mpm = false; //Move player mode
    this.showPageNums = true;
    this.currFrame = 0;

    this.frames = [];

    this.jsonLoaded = false;
}

FormationView.prototype = {

    init : function() {
        this.createToolBar();
        this.generatePositionMap();
        this.createPitch();
        this.createBench();
        this.frames.push(this.createFrameObject());
    },

    updateView : function() {
        this.mpm = false;
        this.isCustomFormation = false;
        this.nodes.clear();
        this.subs.clear();
        this.view.removeChild(this.view.children[2]);
        this.view.removeChild(this.view.children[1]);
        this.generatePositionMap();
        this.createPitch();
        this.createBench();
        this.loadExisitingNodeLists();
        this.reloadPlayers();
        this.setLayer(0);
    },

    updateView2 : function() {
        this.view.removeChild(this.view.children[2]);
        this.view.removeChild(this.view.children[1]);
        this.createPitch(exisitingOverlays = true);
        this.createBench();
        this.loadExisitingNodeLists();
        this.setLayer(this.activeLayer);
        if (this.mpm) {
            this.movePlayerMode();
        };
    },

    updateToolBar : function() {
        this.view.replaceChild(this.createToolBar(), this.view.children[0]);
    },

    createToolBar : function() {
        let toolBar = document.createElement('div');
        let sportOptionLabel = document.createElement('label');
        sportOptionLabel.setAttribute('for', `sportOption${this.teamViewer.viewerId}`);
        sportOptionLabel.innerText = 'Sport';
        let sportOption = document.createElement('select');
        sportOption.setAttribute('id', `sportOption${this.teamViewer.viewerId}`);
        sportOption.addEventListener('change', () => {
            this.movePlayerMode(false);
            let sport = sportOption.value;
            this.setSport(sport);
            this.updateToolBar();
        });
        for (const [key, value] of formations) {
            let option = document.createElement('option');
            option.innerText = key;
            if(key == this.sport) {
                option.selected = 'selected';
            }
            sportOption.appendChild(option);
        }
        toolBar.appendChild(sportOptionLabel);
        toolBar.appendChild(sportOption);
        let formationOptionLabel = document.createElement('label');
        formationOptionLabel.setAttribute('for', `formationOption${this.teamViewer.viewerId}`);
        formationOptionLabel.innerText = 'Formation';
        let formationOption = document.createElement('select');
        formationOption.setAttribute('id', `formationOption${this.teamViewer.viewerId}`);
        formationOption.addEventListener('change', () => {
            this.movePlayerMode(false);
            let style = formationOption.value.split(',');
            let charToInt = num => Number(num);
            let intArr = Array.from(style, charToInt);
            this.setFormation(intArr);
        });
        let forms = formations.get(this.sport);
        for (let i = 0; i < forms.length; i++) {
            let option = document.createElement('option');
            option.innerText = forms[i];
            if (equals(forms[i], this.formationStyle)) {
                option.selected = 'selected';
            }
            formationOption.appendChild(option);
        }
        if (this.isCustomFormation == true) {
            let option = document.createElement('option');
            option.innerText = 'Custom';
            option.selected = 'selected';
            formationOption.appendChild(option);
        }
        toolBar.appendChild(formationOptionLabel);
        toolBar.appendChild(formationOption);
        sportOption.style.cssText = `
        margin: 0 10px;`;
        formationOption.style.cssText = `
        margin: 0 10px;`;
        toolBar.style.cssText = `
        padding: 10px;
        display: flex;
        align-items: center;`

        let drawButton = document.createElement('button');
        if (this.activeLayer == 2) {
            drawButton.style.backgroundColor = 'gray';
        }
        drawButton.innerText = 'Draw';
        drawButton.addEventListener('click', () => {
            if (this.activeLayer != 2) {
                this.movePlayerMode(false);
                this.setLayer(2);
            }
            else {
                this.setLayer(0);
            }
        });
        toolBar.appendChild(drawButton);

        let annotateButton = document.createElement('button');
        if (this.activeLayer == 1) {
            annotateButton.style.backgroundColor = 'gray';
        }
        annotateButton.innerText = 'Annotate';
        annotateButton.addEventListener('click', () => {
            if (this.activeLayer != 1) {
                this.movePlayerMode(false);
                this.setLayer(1);
            }
            else {
                this.setLayer(0);
            }
        });
        toolBar.appendChild(annotateButton);

        let moveButton = document.createElement('button');
        moveButton.innerHTML = '&#8660;';
        moveButton.style.cssText = `
        display: flex;
        align-items: center;
        height: 21px;`;
        if (this.mpm) {
            moveButton.style.backgroundColor = 'gray';
        }
        moveButton.addEventListener('click', () => {
            if (this.mpm == false) {
                this.movePlayerMode();
                moveButton.style.backgroundColor = 'gray';
                this.setLayer(0);
            }
            else {
                this.movePlayerMode(false);
                moveButton.style.backgroundColor = 'initial';
            }
        });
        toolBar.appendChild(moveButton);

        const saveButton = document.createElement('button');
        saveButton.innerHTML = '&#43;';
        saveButton.addEventListener('click', () => {
            this.saveFrame();
        });
        saveButton.style.cssText = `
        display: flex;
        align-items: center;
        height: 21px;`

        toolBar.appendChild(saveButton);

        const cycleButton = document.createElement('button');
        cycleButton.innerHTML = '&#8618;';
        cycleButton.addEventListener('click', () => {
            this.cycleFrames();
        });
        cycleButton.style.cssText = `
        display: flex;
        align-items: center;
        height: 21px;`

        toolBar.appendChild(cycleButton);

        const jsonButton = document.createElement('button');
        jsonButton.innerHTML = 'JSON';
        jsonButton.addEventListener('click', () => {
            this.toJSON();
        });
        jsonButton.style.cssText = `
        display: flex;
        align-items: center;
        height: 21px;`

        toolBar.appendChild(jsonButton);

        this.view.appendChild(toolBar);

        return toolBar;
    },

    createPitch : function(exisitingOverlays = false) {
        this.layers = [];
        let pitch = document.createElement('div');
        pitch.style.width = `70%`;
        pitch.style.height = `100%`;
        pitch.style.backgroundColor = this.theme;
        pitch.style.position = 'relative';
        pitch.style.display = 'inline-block';
        this.view.appendChild(pitch);
        for (let i = 0; i < this.formationStyle.reduce(reducer); i++) {
            let node = document.createElement('div');
            node.addEventListener('drop', (ev) => { 
                ev.preventDefault();
                this.switchPlayers(i, this.nodes);
            });
            node.addEventListener('dragover', function(ev) {
                ev.preventDefault();
            });
            node.style.cssText = `
            width: ${this.nodeSize}px;
            height: ${this.nodeSize}px;
            border-radius: ${this.nodeSize/2}px;
            background-color: white;
            outline: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            bottom: ${this.positionMap.get(i)[0] - this.nodeSize/2};
            left: ${this.positionMap.get(i)[1] - this.nodeSize/2};`;
            node.classList.add('nodeContainer');
            pitch.appendChild(node);
        }
        pitch.classList.add('main');
        this.layers.push('main');

        if (exisitingOverlays == false || this.overlays.length == 0) {
            let annotateOverlay = this.createOverlay('annotateOverlay')
            pitch.appendChild(annotateOverlay);

            let drawOverlay = this.createOverlay('drawOverlay')
            pitch.appendChild(drawOverlay);

            this.overlays = [];
        }

        else {
            this.layers.push('annotateOverlay');
            pitch.appendChild(this.overlays[0]);
    
            this.layers.push('drawOverlay');
            pitch.appendChild(this.overlays[1]);
        }

        const pageIndicator = document.createElement('label');
        pageIndicator.classList.add('pageIndicator');
        if (this.frames.length == 0) {
            pageIndicator.innerText = 'Click + to add new frames.'
        }
        else {
            pageIndicator.innerText = `${this.frames.length}/${this.frames.length}`;
        }
        pageIndicator.style.cssText = `
        font-size: 10px;
        position: absolute;
        bottom : 5px;
        left: 5px;`
        pitch.appendChild(pageIndicator);

    },

    createOverlay : function(overlayType) {
        this.layers.push(overlayType);
        let overlay = null;
        if (overlayType == 'drawOverlay') {
            overlay = this.createDrawOverlay();
            overlay.classList.add(overlayType);
        }
        if (overlayType == 'annotateOverlay') {
            overlay = this.createAnnotateOverlay();
            overlay.classList.add(overlayType);
        }
        overlay.style.cssText = `
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;`
        return overlay;
    },

    //DRAW OVERLAY

    createDrawOverlay : function() {
        const canvas = document.createElement('div');

        const clearButton = document.createElement('button');
        clearButton.classList.add('hideWithLayer');
        clearButton.style.cssText = `
        position: absolute;
        top: 5px;
        left: 5px;`
        clearButton.innerText = 'Clear';
        canvas.appendChild(clearButton);

        const chooseColorSelector = document.createElement('select');
        chooseColorSelector.classList.add('hideWithLayer');
        chooseColorSelector.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;`
        chooseColorSelector.innerHTML = `
        <option value="yellow">Yellow</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="magenta">Magenta</option>
        <option value="cyan">Cyan</option>
        <option value="black">Black</option>`;
        canvas.appendChild(chooseColorSelector);

        this.addDrawEventListeners(clearButton, canvas, chooseColorSelector);

        return canvas;
    },

    addDrawEventListeners : function(clearButton, canvas, chooseColorSelector) {
        clearButton.addEventListener('click', () => {
            this.clearArrows(canvas);
        });

        canvas.addEventListener('click', (e) => {
            if (!e.target.classList.contains('hideWithLayer')) {
                var rect = canvas.getBoundingClientRect();
                var xcoord = e.clientX - rect.x; //x position within the element.
                var ycoord = e.clientY - rect.y;  //y position within the element.
                
                this.currArrow.push({x : xcoord, y : ycoord})

                if (this.currArrow.length == 2) {
                    this.drawArrow(this.currArrow[0], this.currArrow[1], canvas, chooseColorSelector.value);
                    this.currArrow = []
                }
            }
            else {
                this.currArrow = [];
            }
        });
        canvas.addEventListener('mousemove', (e) => {
            var rect = canvas.getBoundingClientRect();
                var xcoord = e.clientX - rect.x; //x position within the element.
                var ycoord = e.clientY - rect.y;  //y position within the element.
                
            if (this.currArrow.length == 1) {
                const arrs = canvas.querySelectorAll('.arrsvg');
                if (arrs.length > 0) {
                    canvas.removeChild(arrs[arrs.length - 1]);
                }
                this.drawArrow(this.currArrow[0], {x : xcoord, y : ycoord}, canvas, chooseColorSelector.value);
            }
        });
    },

    clearArrows : function(canvas) {
        const arrows = canvas.querySelectorAll('.arrsvg');
        for (let i = 0; i < arrows.length; i++) {
            canvas.removeChild(arrows[i]);
        }
    },

    drawArrow : function(c_e1, c_e2, canvas, color){
        var arrsvg = `
        <svg class="arrsvg" style="position:absolute; top:0; left:0; margin:0; width:99.8%; height:99.9%; pointer-events:none;">
        <defs>
        <marker id="arrowHead${color}" markerWidth="8" markerHeight="8" refx="3" refy="4" orient="auto"><path d="M1,1 L1,7 L7,4 L1,1" style="fill:${color};" />
        </marker>
        </defs>
        <path d="M${c_e1.x},${c_e1.y} L${c_e2.x}, ${c_e2.y}" style="stroke:${color}; stroke-width: 2.3px; fill: none; marker-end: url(#arrowHead${color});"/>
        </svg>`;
        canvas.insertAdjacentHTML('beforeend', arrsvg);
    },

    //ANNOTATE OVERLAY

    createAnnotateOverlay : function() {
        const sheet = document.createElement('div');

        const clearButton = document.createElement('button');
        clearButton.classList.add('hideWithLayer');
        clearButton.style.cssText = `
        position: absolute;
        top: 5px;
        left: 5px;`
        clearButton.innerText = 'Clear';
        sheet.appendChild(clearButton);

        this.addAnnotateEventListeners(clearButton, sheet);
        return sheet;
    },

    addAnnotateEventListeners : function(clearButton, sheet) {
        clearButton.addEventListener('click', () => {
            const annotations = sheet.querySelectorAll('.annotation');
            for (let i = 0; i < annotations.length; i++) {
                sheet.removeChild(annotations[i]);
            }
        });
        sheet.addEventListener('click', (e) => {
            if (!e.target.classList.contains('hideWithLayer') && !e.target.classList.contains('annotation') ) {
                var rect = sheet.getBoundingClientRect();
                var xcoord = e.clientX - rect.x; //x position within the element.
                var ycoord = e.clientY - rect.y;  //y position within the element.
                
                const form = document.createElement('input');
                form.setAttribute('placeholder', 'Annotate...')
                form.classList.add('annotation');
                form.style.cssText = `
                width: 100px;
                position: absolute;
                left: ${xcoord - 50}px;
                top: ${ycoord}px;`
                sheet.appendChild(form);
                const drawAnnotation = this.drawAnnotation;

                form.addEventListener('keyup', function onEvent(e) {
                    if (e.key == 'Enter') {
                        drawAnnotation(xcoord, ycoord, form.value, sheet);
                        sheet.removeChild(form);
                    }
                });
            }
        });
    },

    drawAnnotation : function(x, y, text, sheet) {
        const annotation = document.createElement('div');
        annotation.classList.add('annotation');
        annotation.style.cssText = `
        width: 100px;
        word-wrap: break-word;
        background-color: white;
        position: absolute;
        left: ${x - 50}px;
        top: ${y}px;`
        annotation.innerText = text;
        sheet.appendChild(annotation);
    },

    setLayer : function(layerIndex) {
        this.activeLayer = layerIndex;
        for (let i = 0; i < this.layers.length; i++) {
            const overlayType = this.layers[i];
            let layer = this.view.querySelector(`.${overlayType}`);
            const hiddenElements = layer.querySelectorAll('.hideWithLayer');
            if (i == layerIndex) {
                layer.style.pointerEvents = 'auto';
                if (overlayType != 'main') {
                    layer.style.display = 'initial';
                }
                for (let i = 0; i < hiddenElements.length; i++) {
                    hiddenElements[i].style.display = 'initial';
                }
            }
            else {
                layer.style.pointerEvents = 'none';
                for (let i = 0; i < hiddenElements.length; i++) {
                    hiddenElements[i].style.display = 'none';
                }
            }
        }
        this.updateToolBar();
    },

    movePlayerMode(on = true) {
        const pitch = this.view.children[1];
        const nodeContainers = pitch.querySelectorAll('.nodeContainer');
        for (let i = 0; i < nodeContainers.length; i++) {
            const container = nodeContainers[i];
            if (on) {
                this.mpm = true;
                container.children[0].style.pointerEvents = 'none';
                container.setAttribute('draggable', 'true');
                container.addEventListener('dragend', (e) => {
                    var rect = pitch.getBoundingClientRect();
                    var xcoord = e.clientX - rect.x; //x position within the element.
                    var ycoord = rect.bottom - e.clientY;  //y position within the element.
                    if (xcoord > 0 && xcoord < rect.width && ycoord > 0 && ycoord < rect.height) {
                        this.positionMap.set(i, [ycoord, xcoord]);
                        this.isCustomFormation = true;
                        const annotations = this.view.querySelector('.annotateOverlay').cloneNode(true);
                        const drawings = this.view.querySelector('.drawOverlay').cloneNode(true);
                        const addEvents1 = annotations.querySelectorAll('.hideWithLayer');
                        this.addAnnotateEventListeners(addEvents1[0], annotations);
                        const addEvents2 = drawings.querySelectorAll('.hideWithLayer');
                        this.addDrawEventListeners(addEvents2[0], drawings, addEvents2[1]);
                        this.overlays= [annotations, drawings];
                        //this.updateView(true);
                        this.updateView2();
                        this.movePlayerMode();
                    }
                });
            }
            else {
                this.mpm = false;
                container.children[0].style.pointerEvents = 'initial';
                container.setAttribute('draggable', 'false');
            }
        }
    },

    createBench : function() {
        bench = document.createElement('div');
        bench.style.cssText = `
        width: 30%;
        display: inline-block;
        height: ${this.height}px;
        box-sizing: border-box;
        vertical-align: top;
        border: 1px solid black;
        overflow-y: scroll;`;
        this.view.appendChild(bench);
        let benchLabel = document.createElement('div');
        benchLabel.innerText = 'Substitutes';
        bench.appendChild(benchLabel);
        benchLabel.style.cssText = `
        font-size: 120%;
        margin: 10px 10px;`;
        let benchList = document.createElement('ul');
        benchList.style.cssText = `
        list-style: none;
        padding: 0 10px;`;
        bench.appendChild(benchList);
    },

    generatePositionMap : function() {
        let positionIndex = 0;
        for (let line = 0; line < this.formationStyle.length; line++) {
            let spacingy = (this.height / (this.formationStyle.length));
            let lineCoord = (0 + spacingy * (line+1)) - (spacingy/2);
            for (let pos = 0; pos < this.formationStyle[line]; pos++) {
                let spacingx = ((this.width * 0.7) / (this.formationStyle[line]));
                let posCoord = (0 + spacingx * (pos+1)) - (spacingx/2);
                this.positionMap.set(positionIndex, [lineCoord, posCoord]);
                positionIndex++;
            }
        }
    },

    reloadPlayers : function() {
        for (let i = 0; i < this.teamViewer.players.length; i++) {
            this.addPlayer(this.teamViewer.players[i]);
        }
    },

    addPlayer : function(player) {
        let takenPositions = []
        for (const [key, value] of this.nodes.entries()) {
            takenPositions.push(value);
        }
        let isSub = true;
        for (let i = 0; i < this.formationStyle.reduce(reducer); i++) {
            if (!takenPositions.includes(i)) {
                isSub = false;
                this.nodes.set(player, i);
                let nodeBody = this.createNodeBody(player);
                this.addNode(this.nodes.get(player), nodeBody);
                break;
            }
        }
        if (isSub) {
            let subIndex = this.subs.size;
            this.subs.set(player, subIndex);
            let sub = this.createSub(player);
            this.addSub(sub);
        }
    },

    loadExisitingNodeLists : function() { //Alternative to reload players if you want to keep node positions
        for (const [key, value] of this.nodes.entries()) {
            const nodeBody = this.createNodeBody(key);
            const node = value;
            this.addNode(node, nodeBody);
        }
        for (const [key, value] of this.subs.entries()) {
            const nodeBody = this.createSub(key);
            const node = value;
            this.addSub(nodeBody);
        }
    },

    saveFrame : function() {
        this.frames[this.currFrame] = this.createFrameObject();
        const obj = this.createFrameObject();
        this.frames.push(obj);
        this.currFrame = this.frames.length -1;
        this.overlays = [];
        this.updateView2();
    },

    createFrameObject : function() {
        const annotations = this.view.querySelector('.annotateOverlay').cloneNode(true);
        const drawings = this.view.querySelector('.drawOverlay').cloneNode(true);
        return {
            overlays : [annotations, drawings],
            sport : this.sport.slice(),
            subs : new Map(this.subs),
            nodes : new Map(this.nodes),
            formationStyle : this.formationStyle.slice(),
            positionMap : new Map(this.positionMap),
            isCustom : this.isCustomFormation,
        };
    },

    loadFrame : function(frame) {
        const overlays = frame.overlays;
        const addEvents1 = overlays[0].querySelectorAll('.hideWithLayer');
        this.addAnnotateEventListeners(addEvents1[0], overlays[0]);
        const addEvents2 = overlays[1].querySelectorAll('.hideWithLayer');
        this.addDrawEventListeners(addEvents2[0], overlays[1], addEvents2[1]);
        this.overlays = overlays;
        this.sport = frame.sport;
        this.subs = frame.subs;
        console.log(this.subs);
        this.nodes = frame.nodes;
        this.formationStyle = frame.formationStyle;
        this.positionMap = frame.positionMap;
        this.draggedPlayer = null;
        this.isCustomFormation = frame.isCustom;
    },

    toJSON : function() {
        const obj = this.createFrameObject();
        const annotations = [];
        const drawings = [];
        const arrows = obj.overlays[1].querySelectorAll('.arrsvg');
        for (let i = 0; i < arrows.length; i++) {
            const paths = arrows[i].querySelectorAll('path');
            console.log(paths[1]);
            const color = paths[0].style.fill;
            const d = paths[1].getAttribute('d');
            const coord1x = d.substring(
                1,
                d.indexOf(",")
            );
            const coord1y = d.substring(
                d.indexOf(",") + 1,
                d.indexOf(" ")
            );
            const coord2x = d.substring(
                d.indexOf("L") + 1,
                d.lastIndexOf(",")
            );
            const coord2y = d.substring(
                d.lastIndexOf(",") + 2,
                d.length
            );
            console.log([[coord1x, coord1y], [coord2x, coord2y], color]);
            drawings.push([[coord1x, coord1y], [coord2x, coord2y], color]);
        }
        const notes = obj.overlays[0].querySelectorAll('.annotation');
        for (let i = 0; i < notes.length; i++) {
            const x = notes[i].style.left;
            const y = notes[i].style.top;
            const text = notes[i].innerText;
            annotations.push([x, y, text]);
        }
        const nodes = this.mapToList(obj.nodes, true);
        const subs = this.mapToList(obj.subs, true);
        const pmap = this.mapToList(obj.positionMap);
        const stringable = {
            annotations : annotations,
            drawings : drawings,
            sport : obj.sport,
            subs : subs,
            nodes : nodes,
            formationStyle : obj.formationStyle,
            positionMap : pmap,
            isCustom : obj.isCustom,
        };
        const string = JSON.stringify(stringable);
        console.log(string);
        return (string);
    },

    loadJSON : function(json) {
        if (this.frames.length > 1 || this.jsonLoaded) {
            this.saveFrame();
        }
        const obj = JSON.parse(json);
        console.log(obj);
        const nodes = this.listToMap(obj.nodes, playerMap = true);
        const subs = this.listToMap(obj.subs, playerMap = true);
        const pmap = this.listToMap(obj.positionMap);
        this.formationStyle = obj.formationStyle;
        this.sport = obj.sport;
        this.isCustomFormation = obj.isCustom;
        this.positionMap = pmap;
        this.nodes = nodes;
        this.subs = subs;
        this.updateView2();
        const drawOverlay = this.view.children[1].querySelector('.drawOverlay');
        console.log(drawOverlay);
        console.log(obj.drawings);
        for (let i = 0; i < obj.drawings.length; i++) {
            const arrow = obj.drawings[i];
            point1 = {
                x : Number(arrow[0][0]),
                y : Number(arrow[0][1])
            }
            point2 = {
                x : Number(arrow[1][0]),
                y : Number(arrow[1][1])
            }
            this.drawArrow(point1, point2, drawOverlay, arrow[2]);
        };
        const annotateOverlay = this.view.children[1].querySelector('.annotateOverlay');
        for (let i = 0; i < obj.annotations.length; i++) {
            const comment = obj.annotations[i];
            const x = Number(comment[0].substring(0, comment[0].indexOf('p')));
            const y = Number(comment[1].substring(0, comment[1].indexOf('p')));
            this.drawAnnotation(x+50, y, comment[2], annotateOverlay);
            console.log([x, y]);
        };
        for (let i = this.layers.length - 1; i > -1; i--) {
            this.setLayer(i);
        };
        this.jsonLoaded = true;
    },

    mapToList : function(map, playerMap = false) {
        const keys = [];
        const values = [];
        for (const [key, value] of map.entries()) {
            if(playerMap) {
                keys.push([key.name, key.number, key.pos, key.comment]);
            }
            else {
                keys.push(key);
            }
            values.push(value);
        }
        return [keys, values];
    },

    listToMap : function(list, playerMap = false) {
        const map = new Map();
        for (let i = 0; i < list[0].length; i++) {
            let key = list[0][i];
            let val = list[1][i];
            if (playerMap) {
                key = new Player(key[0], key[1], key[2], key[3]);
            }
            map.set(key, val);
        };
        return map;
    },

    cycleFrames : function() {
        const obj = this.createFrameObject();
        this.frames[this.currFrame] = obj;
        if (this.frames.length < 2) {
            return;
        }
        let frame = null;
        //this.frames[this.currFrame] = this.createFrameObject();
        if ((this.currFrame + 1) < this.frames.length) {
            frame = this.frames[this.currFrame + 1];
            this.currFrame = this.currFrame + 1;
        }
        else {
            frame = this.frames[0];
            this.currFrame = 0;
        }
        this.loadFrame(frame);
        this.updateView2();
        if (this.showPageNums == true) {
            const pitch = this.view.children[1];
            const pageNum = pitch.querySelector('.pageIndicator');
            pageNum.innerText = `${this.currFrame+1}/${this.frames.length}`
        }
        console.log(this.currFrame);
    },    
    
    removePlayer : function(player) {
        let sub = this.subs.get(player);
        let node = this.nodes.get(player);
        if (node != null) {
            let nodeBody = this.view.children[1].children[node].children[0];
            this.view.children[1].children[node].removeChild(nodeBody);
            this.nodes.delete(player);
        }
        if (sub != null) {
            let listElement = this.view.children[2].children[1].children[sub];
            this.view.children[2].children[1].removeChild(listElement);
            this.subs.delete(player);
            this.reindexSubs();
        }
    },

    setSport : function(sport) {
        if (formations.get(sport) != null) {
            this.sport = sport;
            this.formationStyle = formations.get(sport)[0];
            this.updateView();
        }
    },

    setFormation : function(formation) {
        if (formations.get(this.sport)[0].reduce(reducer) == formation.reduce(reducer)) {
            this.formationStyle = formation;
            if(!(formationsContains(formations.get(this.sport), formation))) {
                formations.get(this.sport).push(formation);
            }
            this.isCustomFormation = false;
            this.generatePositionMap();
            this.updateView2();
        }
    },

    showPageNums : function (val = true) {
        this.showPageNums = val;
    },

    setPrimaryColor : function(color) {
        this.theme = color;
        this.updateView();
    },

    setAccentColor : function(color) {
        this.secondaryTheme = color;
        this.updateView();
    },

    createNodeBody : function(player) {
        let nodeBody = document.createElement('div');
        nodeBody.setAttribute('draggable', 'true');
        nodeBody.addEventListener('dragstart', (ev) => {
            ev.preventDefault;
            this.collapseNode(nodeBody);
            this.draggedPlayer = player;
        });
        let number = document.createElement('div');
        let name = document.createElement('div');
        let position = document.createElement('div');
        let comment = document.createElement('p');
        let button = createButton('Remove', this.theme);
        button.addEventListener('click', () => {
            this.teamViewer.removePlayer(player);
            document.body.style.cursor = 'default';
        });
        number.innerText = player.number;
        let playerName = player.name;
        let matches = playerName.match(/\b(\w)/g);
        let initials = matches.join('');
        name.innerText = initials;
        position.innerText = player.pos;
        comment.innerText = player.comment;
        nodeBody.appendChild(number);
        nodeBody.appendChild(name);
        nodeBody.appendChild(position);
        nodeBody.appendChild(comment);
        nodeBody.appendChild(button);
        nodeBody.classList.add('collapsed');
        nodeBody.addEventListener('dragover', () => {
            nodeBody.style.boxShadow = '0 0 5px 3px #00ccff';
        });
        nodeBody.addEventListener('dragleave', () => {
            nodeBody.style.boxShadow = 'none';
        });
        nodeBody.addEventListener('mouseover', () => {
            document.body.style.cursor = 'pointer';
            nodeBody.style.boxShadow = '0 0 5px 3px #00ccff';
            if (!nodeBody.classList.contains('collapsed')) {
                nodeBody.style.zIndex = 2;
            }
        });
        nodeBody.addEventListener('mouseout', () => {
            document.body.style.cursor = 'default';
            nodeBody.style.boxShadow = 'none';
            if (!nodeBody.classList.contains('collapsed')) {
                nodeBody.style.zIndex = 1;
            }
        });
        nodeBody.addEventListener('click', () => {
            if (nodeBody.classList.contains('collapsed')) {
                //expand here
                name.innerText = player.name;
                nodeBody.style.cssText = `
                width: auto;
                height: auto;
                z-index: 1;
                padding: 15px;
                border-radius: 5px;
                background-color: white;
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border: 1px solid black;
                min-height: ${this.nodeSize};
                white-space: nowrap;`;
                name.style.cssText = `
                margin-bottom:10px;
                font-size: 120%;`;
                number.style.cssText = `
                margin-bottom: 10px;
                font-size: 150%;`;
                position.style.cssText = `
                display: block;
                margin-bottom: 10px;
                color: gray`;
                comment.style.cssText = `
                display: block;
                margin: 0 0 10px 0;
                min-width: 100px;`;
                button.style.cssText = `
                display: block;
                background-color: ${this.theme};
                height: 40px;
                line-height: 40px;
                border-radius: 20px;
                text-align: center;`;
                nodeBody.classList.remove('collapsed');
            }
            else {
                //collapse here
                name.innerText = initials;
                this.collapseNode(nodeBody);
            }
        });
        comment.style.display = 'none';
        this.collapseNode(nodeBody);
        return nodeBody;

    },

    collapseNode : function(nodeBody) {
        nodeBody.style.cssText = `
        color: white;
        width: ${this.nodeSize - 5}px;
        height: ${this.nodeSize - 5}px;
        border-radius: ${(this.nodeSize - 5)/2}px;
        background-color: ${this.secondaryTheme};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index = 0;
        white-space: nowrap;`;
        let number = nodeBody.children[0];
        number.style.cssText = `
        font-size: 150%;`;
        let position = nodeBody.children[2];
        position.style.cssText = `
        display: none;`;
        let comment = nodeBody.children[3];
        comment.style.cssText = `
        display: none;`;
        let button = nodeBody.children[4];
        button.style.cssText = `
        display: none;`;
        nodeBody.classList.add('collapsed');
        },

    createSub : function(player) {
        const listElement = document.createElement('li');
        listElement.setAttribute('draggable', 'true');
        listElement.addEventListener('dragstart', (ev) => {
            ev.preventDefault;
            this.draggedPlayer = player;
        });
        listElement.addEventListener('drop', (ev) => { 
            ev.preventDefault();
            this.switchPlayers(this.subs.get(player), this.subs);
        });
        listElement.addEventListener('dragover', function(ev) {
            ev.preventDefault();
        });
        const number = document.createElement('div');
        const infoBox = document.createElement('div');
        const name = document.createElement('div');
        const position = document.createElement('div');
        const comment = document.createElement('div');
        number.innerText = player.number;
        name.innerText = player.name;
        position.innerText = player.pos;
        comment.innerText = player.comment;
        listElement.classList.add('collapsed');
        listElement.addEventListener('click', function() {
            if (listElement.classList.contains('collapsed')) {
                listElement.children[2].style.display = 'block';
                listElement.classList.remove('collapsed');
            }
            else {
                listElement.children[2].style.display = 'none';
                listElement.classList.add('collapsed');
            }
        });
        listElement.addEventListener('mouseover', () => {
            document.body.style.cursor = 'pointer';
        });
        listElement.addEventListener('mouseout', () => {
            document.body.style.cursor = 'default';
        });
        listElement.style.cssText = `
        border-bottom: solid 1px gray;
        padding-bottom: 10px;
        box-sizing: border-box;`
        number.style.cssText = `
        height: 50px;
        width: 20%;
        font-size: 150%;
        display: inline-block;
        text-align: center;
        line-height: 50px;`;
        infoBox.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        vertical-align: top;
        margin-left: 5%;
        width: 75%;`;
        name.style.cssText = `
        `;
        position.style.cssText = `
        line-height: 20px;
        color: gray;
        font-size: 80%;`;
        comment.style.cssText = `
        display: none;`;
        infoBox.appendChild(name);
        infoBox.appendChild(position);
        listElement.appendChild(number);
        listElement.appendChild(infoBox);
        listElement.appendChild(comment);
        return listElement;
    },

    switchPlayers : function(index, map) {
        let incomingPlayer = this.draggedPlayer;
        let receivingPlayer = null;
        for (const [key, value] of map.entries()) {
            if (value == index) {
                receivingPlayer = key;
            }
        }
    
        let incomingPlayerNode = this.view.children[1].children[this.nodes.get(incomingPlayer)];
        let receivingPlayerNode = this.view.children[1].children[this.nodes.get(receivingPlayer)];
        let incomingPlayerListEntry = this.view.children[2].children[1].children[this.subs.get(incomingPlayer)];
        let receivingPlayerListEntry = this.view.children[2].children[1].children[this.subs.get(receivingPlayer)];
        if (incomingPlayerNode != null && receivingPlayerNode != null && incomingPlayerListEntry == null && receivingPlayerListEntry == null) {
            let incomingNodeBody = this.createNodeBody(incomingPlayer);
            let receivingNodeBody = this.createNodeBody(receivingPlayer);
            receivingPlayerNode.replaceChild(incomingNodeBody, receivingPlayerNode.children[0]);
            incomingPlayerNode.replaceChild(receivingNodeBody, incomingPlayerNode.children[0]);
            this.nodes.set(receivingPlayer, this.nodes.get(incomingPlayer));
            this.nodes.set(incomingPlayer, index);
        }
        else if (incomingPlayerNode != null && receivingPlayerNode == null && incomingPlayerListEntry == null && receivingPlayerListEntry != null) {
            let subBody = this.createSub(incomingPlayer);
            let nodeBody = this.createNodeBody(receivingPlayer);
            receivingPlayerListEntry.parentNode.replaceChild(subBody, receivingPlayerListEntry);
            incomingPlayerNode.replaceChild(nodeBody, incomingPlayerNode.children[0]);
            this.nodes.set(receivingPlayer, this.nodes.get(incomingPlayer));
            this.nodes.delete(incomingPlayer);
            this.subs.set(incomingPlayer, index);
            this.subs.delete(receivingPlayer);
        }
        else if (incomingPlayerNode == null && receivingPlayerNode != null && incomingPlayerListEntry != null && receivingPlayerListEntry == null) {
            let subBody = this.createSub(receivingPlayer);
            let nodeBody = this.createNodeBody(incomingPlayer);
            incomingPlayerListEntry.parentNode.replaceChild(subBody, incomingPlayerListEntry);
            receivingPlayerNode.replaceChild(nodeBody, receivingPlayerNode.children[0]);
            this.nodes.set(incomingPlayer, index);
            this.nodes.delete(receivingPlayer);
            this.subs.set(receivingPlayer, this.subs.get(incomingPlayer));
            this.subs.delete(incomingPlayer);
        }
        else if (incomingPlayerNode != null && receivingPlayerNode == null && incomingPlayerListEntry == null && receivingPlayerListEntry == null) {
            let nodeBody = this.createNodeBody(incomingPlayer);
            this.view.children[1].children[index].appendChild(nodeBody);
            incomingPlayerNode.removeChild(incomingPlayerNode.children[0]);
            this.nodes.set(incomingPlayer, index);
        }
        else if (incomingPlayerNode == null && receivingPlayerNode == null && incomingPlayerListEntry != null && receivingPlayerListEntry == null) {
            let nodeBody = this.createNodeBody(incomingPlayer);
            this.view.children[1].children[index].appendChild(nodeBody);
            this.view.children[2].children[1].removeChild(incomingPlayerListEntry);
            this.nodes.set(incomingPlayer, index);
            this.subs.delete(incomingPlayer);
            this.reindexSubs();
        }
    },

    addSub : function(sub) {
        let sublist = this.view.children[2].children[1];
        sublist.appendChild(sub);
    },

    reindexSubs : function() {
        let newIndex = 0;
        for (const [key, value] of this.subs.entries()) {
            this.subs.set(key, newIndex);
            newIndex++;
        }
    },

    removeSub : function(sub) {
        let sublist = this.view.children[2].children[1];
        for (let i = 0; i < sublist.children.length; i++) {
            if (sublist.children[i].isEqualNode(sub)) {
                sublist.removeChild(sublist.children[i]);
            }
        }
    },

    addNode : function(nodeID, nodeBody) {
        let node = this.view.children[1].children[nodeID];
        node.appendChild(nodeBody);
    }

}

function PlayerForm(form, teamViewer, width, theme) {
    this.teamViewer = teamViewer;
    this.form = form;
    this.width = width;
    this.theme = theme;
}

PlayerForm.prototype = {

    init : function() {
        viewer = this.teamViewer;
        this.form.style.cssText = `
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        width: ${this.width}px;
        align-items: center;`;
        let nameField = document.createElement('input');
        nameField.setAttribute('placeholder', 'Player Name');
        let numberField = document.createElement('input');
        numberField.setAttribute('placeholder', 'Player Number');
        let positionField = document.createElement('input');
        positionField.setAttribute('placeholder', 'Player Position');
        let commentField = document.createElement('input');
        commentField.setAttribute('placeholder', 'Comment');
        fields = [nameField, numberField, positionField, commentField];
        for (let i = 0; i < fields.length; i++) {
            fields[i].style.cssText = `
            padding-left: 20px;
            height: 40px;
            margin: 5px 10px 5px 0;
            border-radius: 20px;
            outline: 1px solid ${this.theme};
            border: none;`;
        }
        let submitButton = document.createElement('div');
        submitButton.innerHTML = 'Add';
        submitButton.style.cssText = `
        color: white;
        width: 100px;
        height: 40px;
        background-color: ${this.theme};
        outline: 1px solid ${this.theme};
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;`;

        submitButton.addEventListener('click', function() {
            let name = nameField.value;
            let num = numberField.value;
            let pos = positionField.value;
            let com = commentField.value;
            nameField.value = '';
            numberField.value = '';
            positionField.value = '';
            commentField.value = '';
            viewer.addPlayer(name, num, pos, com)});

        submitButton.addEventListener('mouseover', () => {
            document.body.style.cursor = 'pointer';
            submitButton.style.backgroundColor = 'white';
            submitButton.style.color = this.theme;
        });
        submitButton.addEventListener('mouseout', () => {
            submitButton.style.backgroundColor = this.theme;
            submitButton.style.color = 'white';
            document.body.style.cursor = 'default';
        });

        this.form.appendChild((nameField));
        this.form.appendChild((numberField));
        this.form.appendChild((positionField));
        this.form.appendChild((commentField));
        this.form.appendChild((submitButton));
        return this.form;
    },

    updateForm : function() {
        while (this.form.firstChild) {
            this.form.removeChild(this.form.firstChild);
        }
        this.init();
    },

    setTheme : function(theme) {
        this.theme = theme;
        this.updateForm();
    }


}

function Player(name, number, pos, comment) {
    this.name = name;
    this.number = number;
    this.pos = pos;
    this.comment = comment;
}

function createButton(text, color) {
    let button = document.createElement('div');
    button.addEventListener('mouseover', () => {
        document.body.style.cursor = 'pointer';
    });
    button.addEventListener('mouseout', () => {
        document.body.style.cursor = 'default';
    });
    button.innerText = text;
    button.style.cssText = `
    display: flex-box;
    align-items: center;
    justify-content: center;
    background-color: ${color};
    height: 40px;
    border-radius: 20px;`;
    return button;
}

let equals = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

function formationsContains(forms, formation) {
    for (let i = 0; i < forms.length; i++) {
        if(equals(forms[i], formation)) {
            return true
        }
    }
    return false;
}


