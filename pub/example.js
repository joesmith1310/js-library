//Initialise team viewer using the class of this viewer specified in the HTML
//Set the optional color scheme parameter to green
const tv1 = new TeamViewer('viewer1', 'green');

//Cretae all the formation views that appear in the HTML
tv1.createFormationViews();
//Create form which appears in the HTML with width 1000px
tv1.createPlayerForm(1000);

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

const tv2 = new TeamViewer('viewer2');

//Set the theme using function this time
tv2.setTheme('blue');

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

secondFormation.setTheme('#6CB4EE');

secondFormation.setFormation([1,2,2,1]);


//Examples of using more library functions:

//let form = tv1.getPlayerForm();
//tv1.setTheme('blue');