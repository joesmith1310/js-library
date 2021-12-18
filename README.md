# js-library-smith636

__Please view in chrome as this was the browser used for development__

## Landing page:

https://sheltered-retreat-45194.herokuapp.com/teamViewer.html

## Documentation:

https://sheltered-retreat-45194.herokuapp.com/documentation.html

## Getting started:

This guide demonstrates how to incorporate TeamViewer.js into a project, add visual TeamViewer components to HTML and then access these elements in javascript
### 1) Download TeamViewer.js and add it to your project files.

### 2) Include the script for TeamViewer in the HTML before any scripts that use it:
```
<script src="TeamViewer.js" type="text/javascript" defer></script>
```
### 3) In the script that uses TeamViewer.js initialise a TeamViewer object:
```
const tv1 = new TeamViewer('viewer1', 'green', 'red');
```
You must provide a unique id that is associated with this TeamViewer e.g. viewer1

### 4) In your HTML add a div element where you want a TeamViewer component to appear:
```
    <div class="tv-formation-view viewer1"></div>
    <div class="tv-roster-view viewer1"></div>
    <div class="tv-player-form viewer1"></div>
```
The class list of the div should contain the class corresponding to the visual TeamViewer component: 

__FormationView__ = tv-formation-view<br>
__RosterView__ = tv-roster-view<br>
__PlayerForm__ = tv-player-form<br>

The class list of the div should also contain the id of the TeamViewer object you want the component to 
be linked to e.g. viewer1

### 5) In the script that uses TeamViewer.js create the object referenced in the HTML:
```
tv1.createFormationViews();
tv1.createRosterView();
tv1.createPlayerForm();
```
### 6) Access the objects:
```
const fv1 = tv1.createFormationViews(0);
const rv = tv1.getRosterView();
const pf = tv1.getPlayerForm();
```