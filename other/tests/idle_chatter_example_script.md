/* Example page script with soft beat areas for idle chatter */

// === SCROLL TRIGGERS ===
y=100, **moment intro**
y=250, **soft_beat forest_idle**
y=400, **moment forest_scene**
y=600, **end_soft_beat**
y=650, **soft_beat cave_entrance**
y=850, **moment cave_discovery**
y=950, **end_soft_beat**
y=1000, **moment outro**

// === MOMENTS ===
// intro moment
intro LTT; "Welcome to the forest." (0)
intro LTT; "Look around you." (2000)

// forest_scene moment
forest_scene LTT; "Eene walked through the forest, taking in the scenery." (0)
forest_scene LTT; "The trees towered above her." (3000)
forest_scene RTT; "I wonder what's beyond those hills..." (6000)

// cave_discovery moment
cave_discovery RTT; "What's this? A cave entrance?" (0)
cave_discovery LTT; "Emraa approached the dark opening cautiously." (2000)
cave_discovery RTT; "I should check it out..." (4000)

// outro moment
outro LTT; "To be continued..." (0)
