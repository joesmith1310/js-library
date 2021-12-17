document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const dropDowns = document.querySelectorAll('.codeDropDown');
for (let i = 0; i < dropDowns.length; i++) {
    dropDowns[i].addEventListener('click', () => {
        const content = dropDowns[i].parentNode.querySelector('.codeContent');
        console.log(content);
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            content.style.maxHeight = 0;
            content.style.paddingTop = 0;
            content.style.paddingBottom = 0;
        }
        else {
            content.classList.add('expanded');
            content.style.maxHeight = 1000;
            content.style.paddingTop = 20;
            content.style.paddingBottom = 20;
        }
    });
  
}

//Initialise team viewer using the class of this viewer specified in the HTML
//Set the optional color scheme parameters to green and red
const tv1 = new TeamViewer('viewer1', 'green', 'red');

//Create all the formation views that appear in the HTML
tv1.createFormationViews(450, 300, 'Soccer', [1,4,4,2], 50, 'green', '#C70039', true, false, false, false);
tv1.createRosterView(450, 300, 'green', false);

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

let formation2 = tv1.getFormationView(1);
formation2.setOrientation(false);
formation2.setWidth(500);
formation2.setHeight(500);
formation2.showSubs(true);
formation2.enableInteraction(true);

const tv2 = new TeamViewer('viewer2');

tv2.createFormationViews(500, 600, 'Hockey', [1,3,2], 90, 'blue', '#4169E1', false, true, true, true);

tv2.addPlayer('Jack Campbell', 36, 'Goalkeeper', 'Appearances: 12');
tv2.addPlayer('Morgan Reilly', 44, 'Defender', 'Appearances: 9');
tv2.addPlayer('Jake Muzzin', 8, 'Defender', 'Appearances: 1');
tv2.addPlayer('Auston Matthews', 34, 'Center', 'Appearances: 0');
tv2.addPlayer('John Tavares', 91, 'Center', 'Appearances: 1');
tv2.addPlayer('William Nylander', 88, 'Winger', 'Appearances: 12');
tv2.addPlayer('Mitchell Marner', 16, 'Winger', 'Appearances: 12');

//Access the second formation view in this TeamViewer
let secondFormation = tv2.getFormationView(0);

secondFormation.setPrimaryColor('#6CB4EE');
//secondFormation.setAccentColor('blue');

//secondFormation.setFormation([1,2,2,1]);


//Examples of using more library functions:

//let form = tv1.getPlayerForm();
//tv1.setTheme('blue');

const f1 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[83.3,200],[249.89999999999998,100],[249.89999999999998,300],[416.49999999999994,100],[416.49999999999994,300]]],"isCustom":false}';
const f2 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[125.15625,213],[270.15625,132],[299.15625,328],[404.15625,147],[427.15625,324]]],"isCustom":true}';
const f3 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[157.15625,200],[309.15625,140],[309.15625,284],[447.15625,140],[434.15625,274]]],"isCustom":true}';
const f4 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[108.15625,125],[235.15625,41],[251.15625,213],[334.15625,90],[369.15625,221]]],"isCustom":true}';
const f5 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[124.15625,168],[230.15625,112],[247.15625,256],[344.15625,159],[368.15625,255]]],"isCustom":true}';
const f6 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[158.15625,114],[211.15625,163],[264.15625,188],[308.15625,205],[356.15625,318]]],"isCustom":true}';
const f7 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[191.15625,40],[219.15625,128],[301.15625,132],[270.15625,259],[379.15625,267]]],"isCustom":true}';
const f8 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[146.15625,97],[247.15625,195],[280.15625,103],[335.15625,282],[380.15625,166]]],"isCustom":true}';
const f9 = '{"annotations":[],"drawings":[],"sport":"Basketball","subs":[[],[]],"nodes":[[["Scottie Barnes",4,"Power Forward","Height: 6.7"],["Pasal Siakam",43,"Power Forward","Height: 6.8"],["Fred VanVleet",23,"Shooting Guard","Height: 6.1"],["Goran Drajic",1,"Point Guard","Height: 6.3"],["OG Anunoby",3,"Small Forward","Height: 6.7"]],[0,1,2,3,4]],"formationStyle":[1,2,2],"positionMap":[[0,1,2,3,4],[[150.15625,160],[278.15625,243],[280.15625,103],[387.15625,262],[389.15625,114]]],"isCustom":true}';
//formation1.loadJSON(demojson);
//formation1.loadJSON(testjson2);

const rosterView = tv1.getRosterView();
//rosterView.setPrimaryColor('blue');

//START HERE    

const tv3 = new TeamViewer('viewer3');

tv3.createPlayerForm(500, '#981717');
tv3.createFormationViews(500, 400, 'Basketball', [1,2,2], 50, '#dfbb85', '#981717', true, true, true, true);
tv3.createRosterView(500, 400, '#981717');

tv3.addPlayer('Scottie Barnes', 4, 'Power Forward', 'Height: 6.7');
tv3.addPlayer('Pasal Siakam', 43, 'Power Forward', 'Height: 6.8');
tv3.addPlayer('Fred VanVleet', 23, 'Shooting Guard', 'Height: 6.1');
tv3.addPlayer('Goran Drajic', 1, 'Point Guard', 'Height: 6.3');
tv3.addPlayer('OG Anunoby', 3, 'Small Forward', 'Height: 6.7');

const cycleExample = tv3.getFormationView(1);
cycleExample.setOrientation(false);
cycleExample.setWidth(400);
cycleExample.setHeight(500);
cycleExample.enableEdit(false);
cycleExample.enableInteraction(false);
cycleExample.showSubs(false);

cycleExample.loadJSON(f1);
cycleExample.loadJSON(f2);
cycleExample.loadJSON(f3);
cycleExample.loadJSON(f4);
cycleExample.loadJSON(f5);
cycleExample.loadJSON(f6);
cycleExample.loadJSON(f7);
cycleExample.loadJSON(f8);
cycleExample.loadJSON(f9);

cycleExample.setAutoCycle(1000);




