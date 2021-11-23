const tv1 = new TeamViewer('viewer1', 'green');

tv1.createFormationViews();
tv1.createPlayerForm(1000);

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

let formation1 = tv1.getFormationView(0);
formation1.setFormation([1,4,1,2,1,2]);

let form = tv1.getPlayerForm();