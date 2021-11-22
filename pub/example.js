const tv1 = new TeamViewer('viewer1');
tv1.createFormationViews();
tv1.createPlayerForm();

tv1.addPlayer('Joe', 8, 'CM', '');
tv1.addPlayer('Rohan', 4, 'CB', '');
tv1.addPlayer('James', 9, 'ST', '');
tv1.addPlayer('Peter', 6, 'CM', '');
tv1.addPlayer('John', 3, 'CB', '');
tv1.addPlayer('Rui', 5, 'CM', '');
tv1.addPlayer('Barney', 11, 'RW', 'Test comment for css styling purposes');