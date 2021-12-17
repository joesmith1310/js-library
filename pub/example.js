//Initialise team viewer using the class of this viewer specified in the HTML
//Set the optional color scheme parameter to green
const tv1 = new TeamViewer('viewer1', 'green', 'red');

//Cretae all the formation views that appear in the HTML
tv1.createFormationViews(1200, 500, 'Soccer', [1,4,4,2], 70, 'green', '#C70039', true, true, false, true);
//Create form which appears in the HTML with width 1000px
tv1.createPlayerForm(1000);
tv1.createRosterView(1000, 300);

//Add players to the team (Alternative to using form)
tv1.addPlayer('David De Gea', 1, 'Goalkeeper', 'Appearances: 12');
tv1.addPlayer('Victor Lindelof', 2, 'Defender', 'Appearances: 9');
tv1.addPlayer('Eric Bailly', 3, 'Defender', 'Appearances: 1');
tv1.addPlayer('Phil Jones', 4, 'Defender', 'Appearances: 0');
tv1.addPlayer('Harry Maguire', 5, 'Defender', 'Appearances: 1');
tv1.addPlayer('Paul Pogba', 6, 'Midfielder', 'Appearances: 12');
tv1.addPlayer('Fred', 17, 'Midfielder', 'Appearances: 9');
tv1.addPlayer('Bruno Fernandes', 18, 'Midfielder', 'Appearances: 12');
tv1.addPlayer('Nemanja Matic', 31, 'Midfielder', 'Appearances: 5');
tv1.addPlayer('Christiano Ronaldo', 7, 'Forward', 'Appearances: 12');
tv1.addPlayer('Marcus Rashford', 10, 'Forward', 'Appearances: 11');
tv1.addPlayer('Luke Shaw', 23, 'Defender', 'Appearances: 12');
tv1.addPlayer('Aaron Wan Bissaka', 29, 'Defender', 'Appearances: 1');
tv1.addPlayer('Donny Van De Beek', 34, 'Midfielder', 'Appearances: 3');
tv1.addPlayer('Juan Mata', 8, 'Midfielder', 'Appearances: 9');
tv1.addPlayer('Edinson Cavani', 21, 'Forward', 'Appearances: 5');
tv1.addPlayer('Mason Greenwood', 11, 'Forward', 'Appearances: 3');

//Use this to access a specific formation view: (index 0 = first view to appear in HTML)
let formation1 = tv1.getFormationView(0);
//Adding a custom formation:
formation1.setFormation([1,4,1,2,1,2]);
//formation1.setAutoCycle(2000);

const tv2 = new TeamViewer('viewer2');

//Set the theme using function this time
tv2.setPrimaryColor('blue');

tv2.createFormationViews(500, 400, 'Hockey', [1,3,2], 90);

tv2.addPlayer('Jack Campbell', 36, 'Goalkeeper', 'Appearances: 12');
tv2.addPlayer('Morgan Reilly', 44, 'Defender', 'Appearances: 9');
tv2.addPlayer('Jake Muzzin', 8, 'Defender', 'Appearances: 1');
tv2.addPlayer('Auston Matthews', 34, 'Center', 'Appearances: 0');
tv2.addPlayer('John Tavares', 91, 'Center', 'Appearances: 1');
tv2.addPlayer('William Nylander', 88, 'Winger', 'Appearances: 12');
tv2.addPlayer('Mitchell Marner', 16, 'Winger', 'Appearances: 12');

//Access the second formation view in this TeamViewer
let secondFormation = tv2.getFormationView(1);

secondFormation.setPrimaryColor('#6CB4EE');
secondFormation.setAccentColor('blue');

secondFormation.setFormation([1,2,2,1]);


//Examples of using more library functions:

//let form = tv1.getPlayerForm();
//tv1.setTheme('blue');

const testjson = '{"annotations":[["252px","437.188px","Luke Shaw"]],"drawings":[],"sport":"Soccer","subs":[[["Aaron Wan Bissaka",29,"Defender","Appearances: 1"],["Donny Van De Beek",34,"Midfielder","Appearances: 3"],["Juan Mata",8,"Midfielder","Appearances: 9"],["Edinson Cavani",21,"Forward","Appearances: 5"],["Mason Greenwood",11,"Forward","Appearances: 3"],["Harry Maguire",5,"Defender","Appearances: 1"]],[1,2,3,4,5,0]],"nodes":[[["David De Gea",1,"Goalkeeper","Appearances: 12"],["Victor Lindelof",2,"Defender","Appearances: 9"],["Eric Bailly",3,"Defender","Appearances: 1"],["Phil Jones",4,"Defender","Appearances: 0"],["Paul Pogba",6,"Midfielder","Appearances: 12"],["Fred",17,"Midfielder","Appearances: 9"],["Bruno Fernandes",18,"Midfielder","Appearances: 12"],["Nemanja Matic",31,"Midfielder","Appearances: 5"],["Christiano Ronaldo",7,"Forward","Appearances: 12"],["Marcus Rashford",10,"Forward","Appearances: 11"],["Luke Shaw",23,"Defender","Appearances: 12"]],[0,1,2,3,5,6,7,8,9,10,4]],"formationStyle":[1,4,1,2,1,2],"positionMap":[[0,1,2,3,4,5,6,7,8,9,10],[[41.666666666666664,175],[125,43.75],[125,131.25],[125,218.75],[125,306.25],[208.33333333333334,175],[291.66666666666663,87.5],[291.66666666666663,262.5],[374.99999999999994,175],[458.3333333333333,87.5],[458.3333333333333,262.5]]],"isCustom":false}'
const testjson2 = '{"annotations":[],"drawings":[[["301","408.1875"],["304","329.1875"],"yellow"],[["301","408.1875"],["304","329.1875"],"yellow"]],"sport":"Soccer","subs":[[["Aaron Wan Bissaka",29,"Defender","Appearances: 1"],["Donny Van De Beek",34,"Midfielder","Appearances: 3"],["Juan Mata",8,"Midfielder","Appearances: 9"],["Edinson Cavani",21,"Forward","Appearances: 5"],["Mason Greenwood",11,"Forward","Appearances: 3"],["Harry Maguire",5,"Defender","Appearances: 1"]],[1,2,3,4,5,0]],"nodes":[[["David De Gea",1,"Goalkeeper","Appearances: 12"],["Victor Lindelof",2,"Defender","Appearances: 9"],["Eric Bailly",3,"Defender","Appearances: 1"],["Phil Jones",4,"Defender","Appearances: 0"],["Paul Pogba",6,"Midfielder","Appearances: 12"],["Fred",17,"Midfielder","Appearances: 9"],["Bruno Fernandes",18,"Midfielder","Appearances: 12"],["Nemanja Matic",31,"Midfielder","Appearances: 5"],["Christiano Ronaldo",7,"Forward","Appearances: 12"],["Marcus Rashford",10,"Forward","Appearances: 11"],["Luke Shaw",23,"Defender","Appearances: 12"]],[0,1,2,3,5,6,7,8,9,10,4]],"formationStyle":[1,4,1,2,1,2],"positionMap":[[0,1,2,3,4,5,6,7,8,9,10],[[41.666666666666664,175],[125,43.75],[125,131.25],[125,218.75],[216.8125,306],[208.33333333333334,175],[291.66666666666663,87.5],[291.66666666666663,262.5],[374.99999999999994,175],[458.3333333333333,87.5],[458.3333333333333,262.5]]],"isCustom":true}'
const demojson = '{"annotations":[["590px","413.188px","Add drawings"],["43px","394.188px","Make annotations"],["26px","100.188px","Customise sizes and colors"],["643px","54.1875px","Swap players around"],["334px","424.188px","Move players around"],["361px","42.1875px","Save figures"],["643px","303.188px","Expandable nodes"]],"drawings":[[["257","467.1875"],["215","387.1875"],"white"],[["159","52.1875"],["248","51.1875"],"white"],[["531","170.1875"],["543","148.1875"],"white"],[["475","117.1875"],["511","118.1875"],"white"],[["589","358.1875"],["692","356.1875"],"white"],[["589","358.1875"],["692","356.1875"],"white"]],"sport":"Soccer","subs":[[["Luke Shaw",23,"Defender","Appearances: 12"],["Aaron Wan Bissaka",29,"Defender","Appearances: 1"],["Donny Van De Beek",34,"Midfielder","Appearances: 3"],["Juan Mata",8,"Midfielder","Appearances: 9"],["Edinson Cavani",21,"Forward","Appearances: 5"],["Mason Greenwood",11,"Forward","Appearances: 3"]],[0,1,2,3,4,5]],"nodes":[[["David De Gea",1,"Goalkeeper","Appearances: 12"],["Victor Lindelof",2,"Defender","Appearances: 9"],["Eric Bailly",3,"Defender","Appearances: 1"],["Phil Jones",4,"Defender","Appearances: 0"],["Harry Maguire",5,"Defender","Appearances: 1"],["Paul Pogba",6,"Midfielder","Appearances: 12"],["Fred",17,"Midfielder","Appearances: 9"],["Bruno Fernandes",18,"Midfielder","Appearances: 12"],["Nemanja Matic",31,"Midfielder","Appearances: 5"],["Christiano Ronaldo",7,"Forward","Appearances: 12"],["Marcus Rashford",10,"Forward","Appearances: 11"]],[0,1,2,3,4,5,6,7,8,9,10]],"formationStyle":[1,4,1,2,1,2],"positionMap":[[0,1,2,3,4,5,6,7,8,9,10],[[250,46.66666666666667],[161.8125,196],[246.8125,191],[342.8125,191],[448.8125,296],[388.8125,433],[286.8125,391],[453.8125,574],[289.8125,524],[141.8125,548],[370.8125,646]]],"isCustom":true}';
formation1.loadJSON(demojson);
//formation1.loadJSON(testjson2);

const rosterView = tv1.getRosterView();
rosterView.setPrimaryColor('blue');