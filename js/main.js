import { Game } from './Game.js';
import { Item } from './Item.js';
import { Inventory } from './Inventory.js';
import { LevelManager } from './LevelManager.js';
import { Level } from './Level.js';


document.addEventListener('DOMContentLoaded', () => {
    const levelManager = LevelManager.getInstance();
    
    let hallwayMatrixImages = [
        ['./images/Door.jpg', './images/hallway1.jpg', './images/Door.jpg'],
        [null, './images/hallway2.jpg', null],
        ['./images/Door.jpg', './images/hallway3.jpg', './images/Door.jpg'],
        [null, './images/hallway4.jpg', null],
        ['./images/Door.jpg', './images/hallway5.jpg', './images/Door.jpg'],
        [null, './images/hallway6.jpg', null],
        ['./images/Door.jpg', './images/hallway7.jpg', './images/Door.jpg'],
        [null ,'./images/hallway8.jpg', null],
        ['./images/Door.jpg', './images/hallway9.jpg', './images/Door.jpg'],
        [null, './images/hallway10.jpg', null],
        ['./images/Door.jpg', './images/hallway11.jpg', './images/Door.jpg'],
        [null, './images/hallway12.jpg', null],
        ['./images/Door.jpg', './images/hallway13.jpg', './images/Door.jpg'],
        [null, './images/hallway14.jpg',null],
        [null, './images/Janitor.jpg', null],
        [null, './images/Key.jpg', null]
    ];

    let secondHallwayMatrixImages = [
        ['./images/Door.jpg', './images/hallway1.jpg', './images/Door.jpg'],
        [null, './images/hallway2.jpg', null],
        ['./images/Door.jpg', './images/hallway3.jpg', './images/Door.jpg'],
        [null, './images/hallway4.jpg', null],
        ['./images/Door.jpg', './images/hallway5.jpg', './images/Door.jpg'],
        [null, './images/hallway6.jpg', null],
        ['./images/Door.jpg', './images/hallway7.jpg', './images/Door.jpg']
    ];


    
    let classroomMatrixImages =[
        [null, null, null],
        [null, './images/Classroom.jpg', null]
    ];

    let stairsMatrixImages =[
        ['./images/Stairs-1.png', null, null],
        ['./images/Stairs0.png', null, null],
        ['./images/Stairs1.png', null, null]
    ];

    let infirmaryMatrixImages =[
        [null, null, null],
        [null, null , './images/infirmary.jpg']

    ];

    let class205MatrixImages =[
        [null, null, './images/Class205.png'],
        [null, null , null]
    ];

    let bedRoom = [
        [null, null, null],
        [null, './images/Bedroom.jpg', null],
        [null, './images/BedroomMirror.jpg', null]
    ];

    let UnderGroundStartMatrixImages = [
        ['./images/UndergroundStart.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];

    let UnderGroundGasMatrixImages = [
        ['./images/UndergroundGas.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];

    let UnderGroundLibraryMatrixImages = [
        ['./images/UndergroundLibrary.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];

    let UnderGroundBooksMatrixImages = [
        ['./images/UndergroundLibraryBooks.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];

    let UnderGroundEmptyMatrixImages = [
        ['./images/UndergroundEmpty.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];

    let UnderGroundLabMatrixImages = [
        ['./images/UndergroundLaboratory.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    let UnderGroundLabPCMatrixImages = [
        ['./images/UndergroundLaboratoryPC.jpg', null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    
    levelManager.addLevel('Hallway', new Level('Hallway', hallwayMatrixImages, 1, 0));
    levelManager.addLevel('Classroom', new Level('Classroom', classroomMatrixImages, 1, 1));
    levelManager.addLevel('SecondHallway', new Level('SecondHallway', secondHallwayMatrixImages, 1, 0));
    levelManager.addLevel('Stairs', new Level('Stairs', stairsMatrixImages, 0, 1));
    levelManager.addLevel('Infirmary', new Level('Infirmary', infirmaryMatrixImages, 2, 1));
    levelManager.addLevel('Class205', new Level('Class205', class205MatrixImages, 2, 0));
    levelManager.addLevel('BedRoom', new Level('BedRoom', bedRoom, 1, 1));
    levelManager.addLevel('U_Start', new Level('U_Start', UnderGroundStartMatrixImages, 0,0));
    levelManager.addLevel('U_Gas', new Level('U_Gas', UnderGroundGasMatrixImages, 0,0));
    levelManager.addLevel('U_Library', new Level('U_Library', UnderGroundLibraryMatrixImages, 0,0));
    levelManager.addLevel('U_Books', new Level('U_Books', UnderGroundBooksMatrixImages, 0,0));
    levelManager.addLevel('U_Empty', new Level('U_Empty', UnderGroundEmptyMatrixImages, 0,0));
    levelManager.addLevel('U_Lab', new Level('U_Lab', UnderGroundLabMatrixImages, 0,0));
    levelManager.addLevel('U_LabPC', new Level('U_LabPC', UnderGroundLabPCMatrixImages, 0,0));

    levelManager.setCurrentLevel('Classroom');

    // Avvia il gioco
    const game = new Game();
    game.start();

    const inventory = Inventory.getInstance();
    inventory.addItem(0, 0, new Item('Letter', './images/letter.png'));
});