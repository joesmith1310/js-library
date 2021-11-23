const formations = new Map([
    ['Soccer', [[1,4,4,2], [1,4,3,3]]],
    ['Hockey', [[1,3,2]]]
]);

const reducer = (accumulator, curr) => accumulator + curr;

function TeamViewer(viewerId, theme = 'green') {
    this.viewerId = viewerId;
    this.formationViews = [];
    this.playerForm = null;
    this.players = [];
    this.theme = theme;
}

TeamViewer.prototype = {

    createFormationViews : function(width = 400, height = 500, sport = 'Soccer', formation = [1,4,4,2], nodeSize = 70) {
        let views = document.getElementsByClassName('tv-formation-view');

        for (let i = 0; i < views.length; i++) {
            if (views[i].classList.contains(this.viewerId)) {
                let view = views[i]
                console.log(view);
                let formationView = new FormationView(view, this, width, height, sport, formation, nodeSize);
                this.formationViews.push(formationView);
                formationView.init();
            }
        }
    },

    createPlayerForm : function() {
        let forms = document.getElementsByClassName('tv-player-form');
        let form = null;

        for (let i = 0; i < forms.length; i++) {
            if (forms[i].classList.contains(this.viewerId)) {
                form = forms[i];
                console.log(form);
                let playerForm = new PlayerForm(form, this);
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
            console.log(this.players[i].name);
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

    //getPlayerKey: function(playerNumber)
}

function FormationView(view, teamViewer, width, height, sport, formation, nodeSize) {
    this.teamViewer = teamViewer;
    this.sport = sport;
    this.view = view;
    this.subs = new Map();
    this.nodes = new Map();
    this.width = width;
    this.height = height;
    this.formationStyle = formation;
    this.positionMap = new Map();
    this.nodeSize = nodeSize;
    this.draggedPlayer = null;
}

FormationView.prototype = {

    init : function() {
        this.createToolBar();
        this.createPitch();
        this.createBench();
    },

    updateView : function() {
        console.log('view updated');
        console.log(this.view.children[1]);
        this.nodes.clear();
        this.subs.clear();
        this.view.removeChild(this.view.children[2]);
        this.view.removeChild(this.view.children[1]);
        this.createPitch();
        this.createBench();
        this.reloadPlayers();
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
            console.log("Option selected");
            let sport = sportOption.value;
            this.changeSport(sport);
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
            console.log("Option selected");
            let style = formationOption.value.split(',');
            let charToInt = num => Number(num);
            let intArr = Array.from(style, charToInt);
            this.changeFormation(intArr);
        });
        let forms = formations.get(this.sport);
        for (let i = 0; i < forms.length; i++) {
            let option = document.createElement('option');
            option.innerText = forms[i];
            formationOption.appendChild(option);
        }
        toolBar.appendChild(formationOptionLabel);
        toolBar.appendChild(formationOption);
        this.view.appendChild(toolBar);
        sportOption.style.cssText = `
        margin: 0 10px;`;
        formationOption.style.cssText = `
        margin: 0 10px;`;
        toolBar.style.cssText = `
        padding: 10px;
        display: flex;
        align-items: center;`
        return toolBar;
    },

    createPitch : function() {
        let pitch = document.createElement('div');
        pitch.style.width = `${this.width}px`;
        pitch.style.height = `${this.height}px`;
        pitch.style.backgroundColor = this.teamViewer.theme;
        pitch.style.position = 'relative';
        pitch.style.display = 'inline-block';
        this.view.appendChild(pitch);
        this.generatePositionMap();
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
            pitch.appendChild(node);
        }
    },

    createBench : function() {
        bench = document.createElement('div');
        bench.style.cssText = `
        width: 200px;
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
            let lineCoord = 0 + (this.height / (this.formationStyle.length + 1)) * (line+1);
            for (let pos = 0; pos < this.formationStyle[line]; pos++) {
                let posCoord = 0 + (this.width / (this.formationStyle[line] + 1)) * (pos+1)
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
        }
    },

    changeSport : function(sport) {
        if (formations.get(sport) != null) {
            this.sport = sport;
            this.formationStyle = formations.get(sport)[0];
            this.updateView();
        }
    },

    changeFormation : function(formation) {
        if (formations.get(this.sport)[0].reduce(reducer) == formation.reduce(reducer)) {
            this.formationStyle = formation;
            this.updateView();
        }
    },

    createNodeBody : function(player) {
        let nodeBody = document.createElement('div');
        nodeBody.setAttribute('draggable', 'true');
        nodeBody.addEventListener('dragstart', (ev) => {
            ev.preventDefault;
            this.collapseNode(nodeBody);
            this.draggedPlayer = player;
        });
        let number = document.createElement('label');
        let name = document.createElement('label');
        let position = document.createElement('label');
        let comment = document.createElement('p');
        let button = createButton('Remove', this.teamViewer.theme);
        button.addEventListener('click', () => {
            this.teamViewer.removePlayer(player);
            document.body.style.cursor = 'default';
        });
        number.innerText = player.number;
        name.innerText = player.name;
        position.innerText = player.pos;
        comment.innerText = player.comment;
        nodeBody.appendChild(number);
        nodeBody.appendChild(name);
        nodeBody.appendChild(position);
        nodeBody.appendChild(comment);
        nodeBody.appendChild(button);
        nodeBody.classList.add('collapsed');
        nodeBody.addEventListener('click', () => {
            if (nodeBody.classList.contains('collapsed')) {
                //expand here
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
                min-height: ${this.nodeSize}`;
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
                background-color: ${this.teamViewer.theme};
                height: 40px;
                line-height: 40px;
                border-radius: 20px;
                text-align: center;`;
                nodeBody.classList.remove('collapsed');
            }
            else {
                //collapse here
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
        width: ${this.nodeSize - 10}px;
        height: ${this.nodeSize - 10}px;
        border-radius: ${(this.nodeSize - 10)/2}px;
        background-color: red;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;`;
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
        const number = document.createElement('label');
        const infoBox = document.createElement('div');
        const name = document.createElement('label');
        const position = document.createElement('label');
        const comment = document.createElement('label');
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
        })
        listElement.style.cssText = `
        border-bottom: solid 1px gray;
        padding-bottom: 10px;
        box-sizing: border-box;`
        number.style.cssText = `
        height: 50px;
        width: 50px;
        font-size: 150%;
        display: inline-block;
        text-align: center;
        line-height: 50px;`;
        infoBox.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        vertical-align: top;
        margin-left: 10px;`;
        name.style.lineHeight = '30px';
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
        }
    },

    addSub : function(sub) {
        let sublist = this.view.children[2].children[1];
        sublist.appendChild(sub);
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

function PlayerForm(form, teamViewer) {
    console.log(teamViewer);
    this.teamViewer = teamViewer;
    console.log(this.teamViewer);
    this.form = form;
    
}

PlayerForm.prototype = {

    init : function() {
        viewer = this.teamViewer;
        this.form.style.cssText = `
        padding: 50px;
        display: flex;
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
            margin-right: 10px;
            border-radius: 20px;
            outline: 1px solid ${this.teamViewer.theme};
            border: none;`;
        }
        let submitButton = document.createElement('div');
        submitButton.innerHTML = 'Add';
        submitButton.style.cssText = `
        width: 100px;
        height: 50px;
        background-color: ${this.teamViewer.theme};
        border-radius: 25px;
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

        this.form.appendChild((nameField));
        this.form.appendChild((numberField));
        this.form.appendChild((positionField));
        this.form.appendChild((commentField));
        this.form.appendChild((submitButton));
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
    button.addEventListener('mouseleave', () => {
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

