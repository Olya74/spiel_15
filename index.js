import {Player} from "./classes/Player.js";

let img = new Image();
img.src='asserts/img/4.png';
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnSelect = document.querySelector(".btnSelect");
const start=document.getElementById('start');
const timeEl=document.getElementById('time');
const pause=document.getElementById('pause');
const inpName=document.getElementById('name');
const containerNode=document.getElementById('fifteen');
const itemNodes=Array.from(containerNode.querySelectorAll('.item'));
const newGame=document.getElementById('newGame');
const spanName=document.getElementById('spanName');
const myPuzzle=document.getElementById('myPuzzle');
const pName=document.getElementById('pName');
const inpImg=document.getElementById('inpImg');
const imgSelect=document.getElementById('imgSelect');
const imgList=document.getElementById('imgList');
let CELL_SIZE = 4;
const countItems=16;
const puzzleWidth = canvas.width/CELL_SIZE;
const puzzleHeight = canvas.height/CELL_SIZE;
const blankNumber=countItems;
const imagePieceWidth = img.width / CELL_SIZE; 
const imagePieceHeight = img.height / CELL_SIZE; 

let players;   
let currentPlayer;
let idTimer ;
let isPaused;
let isStarted;
let victory;
let unvictory;
let audio=null;
let startMinutes =15;
let time=startMinutes*60;
let imgArr=[];

players =(JSON.parse(localStorage.getItem('players')) || []).map((obj)=>Player.fromJSON(obj));


//current player by name from input
    inpName.addEventListener('change', (e) => {
        const existingPlayer = players.find(
            (player) => player.name === e.target.value
        );
        if (existingPlayer) {
            existingPlayer.setActive(true);
            currentPlayer = existingPlayer;
        } else {
            currentPlayer = new Player(e.target.value);
            currentPlayer.setActive(true);
            players.push(currentPlayer);
        }
    
        // Deactivate other players
        players.forEach((player) => {
            if (player.name !== currentPlayer.name) {
                player.setActive(false);
            }
        });
    
        localStorage.setItem('players', JSON.stringify(players));
        spanName.textContent = `Welcome, ${currentPlayer.name}`;
        inpName.value = '';
        console.log('currentPlayer after login:', currentPlayer);
    });

let imgSrc=['asserts/img/1.png','asserts/img/2.png','asserts/img/3.png','asserts/img/4.png','asserts/img/D1.png'];

let matrix=getMatrix(
itemNodes.map((item)=>Number(item.dataset.matrixId)));

if(itemNodes.length!==countItems){
    throw new Error('Invalid number of items');
}
itemNodes[countItems-1].style.display='none';


const init = function () {
    isStarted=false;
    isPaused=false;
    victory=false;
    unvictory=false;
    img.addEventListener('load',()=>{
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
   setPositionItemsWithPicture(matrix,itemNodes);
   matrix=getMatrix(shuffleArray(matrix));
   setPositionItems(matrix,itemNodes);
   //setPositionItemsWithPicture(matrix,itemNodes);
   console.log('isStartedInit:',isStarted);
    });
    currentPlayer = players.find((player)=>player.active===true) || new Player('Guest');
    spanName.textContent = `Welcome, ${currentPlayer.name}`;
  };
    init();

//events

newGame.addEventListener('click',(e)=>{
    resetTimer();
    isStarted=false;
    isPaused=false;
    victory=false;
    unvictory=false;
    start.textContent='Start';
    start.classList.remove('button_active');
    //game=true;
     matrix=getMatrix(shuffleArray(matrix));
    setPositionItems(matrix,itemNodes);
   // setPositionItemsWithPicture(matrix,itemNodes);
});
start.addEventListener('click',()=>{
    isStarted=!isStarted;
    if(isStarted){     
  idTimer = setInterval(updateTimer,1000);
  start.classList.add('button_active');
  start.textContent='Stop';
    }
    else if (!isStarted)
    {
start.classList.remove('button_active');
start.textContent='Start';
resetTimer();
    }

pause.addEventListener('click',()=>{
    isPaused=!isPaused;
    if(isPaused){
        pause.textContent='continue';
        pause.style.backgroundColor='rgb(75, 75, 156)';
    }
    else{
        pause.textContent='Pause';
        pause.style.backgroundColor='black';
    }
});

});
//Eingabe ausblenden
imgSelect.addEventListener('click',(e)=>{
    if(inpImg){inpImg.click();}
    e.preventDefault();   //prevent navigation to #
},false);

inpImg.addEventListener('change',(e)=>{
    const list=document.createElement('ul'); 
    imgList.appendChild(list);
    let URL=window.webkitURL || window.URL;
    let files=e.target.files;
    if(files.length <=0 ) return;
    for(let i=0;i<files.length;i++){
            let myImg = new Image();
            const li=document.createElement('li');
            list.appendChild(li);
            myImg.width=100;
            myImg.height=100;
            myImg.src=URL.createObjectURL(files[i]);
            li.appendChild(myImg);
            imgArr.push(myImg);
           URL.revokeObjectURL(files[i]);
    }
    
    let res =confirm('Do you want to save the image on your computer?');
           if(res){
           canvas.toBlob(function(blob){
               let link=document.createElement('a');
               link.href=URL.createObjectURL(blob);
               link.download='imgBlob.png';
               link.click();
               URL.revokeObjectURL(link.href);}, 'image/png');
           }
   if(imgArr.length>0){
                img.src=imgArr[0].src;
                img.addEventListener('load',()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        setPositionItemsWithPicture(matrix,itemNodes);  
   });
    btnSelect.textContent ='Click on the selected image';
    }
    
});
        

document.getElementById('shuffle').addEventListener('click',()=>{
    matrix=getMatrix(shuffleArray(matrix));
    setPositionItems(matrix,itemNodes);
    
   // setPositionItemsWithPicture(matrix,itemNodes);
});

containerNode.addEventListener('click',(e)=>{
    const buttonNode=e.target.closest('button');
    if(!buttonNode){
        return;
    }
    const buttonValue=Number(buttonNode.dataset.matrixId);
    const blankCoord=coordByValue(matrix,blankNumber);
    const buttonCoord=coordByValue(matrix,buttonValue);
    const isValid=isValidForSwap(blankCoord,buttonCoord);
    if(isValid){
        swap(blankCoord,buttonCoord,matrix);
        setPositionItems(matrix,itemNodes);
    }
    if(isVictory(matrix)){
      victory=true;
      audio = audioWithPath('asserts/img/victory.mp3');
        createBtnAudio(audio);
        alert('Victory');
        isStarted=false;
    }
});


document.addEventListener('click',(e)=>{
    if(e.target.closest('img')){
       img.src=e.target.src;
       img.addEventListener('load',()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        setPositionItemsWithPicture(matrix,itemNodes);});
    }
}
);
// imgList.addEventListener('click',(e)=>{
//     let imgNode=e.target.closest('img');
//     for(let player of players){
   
//        if(player.active===true){
//               currentPlayer=player;
//               break;
//        }
//        if (currentPlayer && typeof currentPlayer.setBilder === 'function') {
//         currentPlayer.setBilder(img.src);
//     } else {
//         console.error("currentPlayer or setBilder is undefined");
//     }
//        console.log('currentPl',currentPlayer);
       
//     }
//     if(imgNode){
//         img.src = imgNode.src;
        
       
//         img.addEventListener('load',()=>{
//         ctx.clearRect(0,0,canvas.width,canvas.height);
//        // ctx.drawImage(img,0,0,canvas.width,canvas.height);
//         setPositionItemsWithPicture(matrix,itemNodes);});
//         }
// });

imgList.addEventListener('click', (e) => {
    const imgNode = e.target.closest('img');
    if (!imgNode) return;

    // Ensure currentPlayer is active
    currentPlayer = players.find((player) => player.active);
    if (!currentPlayer || typeof currentPlayer.setBilder !== 'function') {
        console.error('currentPlayer or setBilder is undefined');
        return;
    }

    img.src = imgNode.src;
    img.addEventListener('load', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setPositionItemsWithPicture(matrix, itemNodes);
    });

});

/* helpers */

function updateTimer(){
    isStarted=true;
    if(isStarted && !isPaused){
    let minutes=Math.floor(time/60);
    let seconds=time%60;
    seconds=seconds<10?'0'+seconds:seconds;
    minutes=minutes<10?'0'+minutes:minutes;
    timeEl.innerHTML=`${minutes}:${seconds}`;
    setTimerStyle();
    time--;
    }
    if(time < 0){
       isStarted=false;
        unvictory=true;
        audio = audioWithPath('asserts/img/ups.mp3');
        resetTimer();
        audio=null;
    }
console.log('isStartedUpdate:',isStarted);

}
function setTimerStyle(){
    timeEl.classList.add('time_active');
    const span=document.createElement('span');
    span.style.fontSize='1.3rem';
    span.textContent='Time has begun: ';
    timeEl.prepend(span); 
    timeEl.style.display='inline-block'; 
}
function resetTimer(){
    audio=null
    time=startMinutes*60;
    timeEl.innerHTML='';
    timeEl.previousSibling.textContent='';
    timeEl.style.display='none';
    start.style.opacity=1;
    clearInterval(idTimer);

}


function getMatrix(array){
    const matrix=[];
    while(array.length){
        matrix.push(array.splice(0,4));
    }
    return matrix;
}


function setPositionItems(matrix,arr){
for(let i=0;i<matrix.length;i++){
    for(let j=0;j<matrix[i].length;j++){
        const itemNode=arr[matrix[i][j]-1];
        setNodesStyle(itemNode,j,i);
    }
  }
}
function setNodesStyle(node,x,y,shiftPs=100){
    node.style.transform=`translate3D(${x*shiftPs}%,${y*shiftPs}%,0)`;
}

function setPositionItemsWithPicture(matrix,arr){
      for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
        let itemNodeImg=arr[matrix[i][j]-1];
           const sizeMatrixCell=matrix[i].length;
            const itemNode=matrix[i][j];
            const srcCol= (itemNode - 1) % sizeMatrixCell;
            const srcRow= Math.floor((itemNode - 1) / sizeMatrixCell);


            // Координаты на canvas (назначение)
            const destX = j * puzzleWidth;
            const destY = i * puzzleHeight;
            
       if (itemNode !== blankNumber) {
        
        setNodesStyleWithPicture(srcCol,srcRow,destX,destY,itemNodeImg);
       }
       else {
        // Для пустого сектора делаем его белым
        ctx.fillStyle = "#c3cfe2 ";
        ctx.fillRect(destX, destY, puzzleWidth, puzzleHeight);
        itemNodeImg.style.backgroundImage = "none";

    }
  
    }
    }
    }
    function setNodesStyleWithPicture(srcCol,srcRow,destX,destY,node){
   // node.style.transform=`translate3D(${srcCol*puzzleWidth}%,${srcRow*puzzleHeight}%,0)`;
    //ctx.clearRect(0,0,CELL_SIZE,CELL_SIZE);
    ctx.fillStyle='white';
    ctx.drawImage(
        img,
        srcCol*imagePieceWidth,  srcRow*imagePieceHeight,  
        imagePieceWidth,imagePieceHeight,                         
           destX, destY,   
           puzzleWidth,puzzleHeight                               
    );
   node.style.backgroundImage=`url(${canvas.toDataURL()})`;
   node.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
   node.style.backgroundPosition = `-${destX}px -${destY}px`;
}
function shuffleArray(array){
    let newArr=array.flat();
    for(let i=newArr.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [newArr[i],newArr[j]]=[newArr[j],newArr[i]];
    }
    return newArr;
}
    function coordByValue(arr,value){
        for(let i=0;i<arr.length;i++){
            for(let j=0;j<arr[i].length;j++){
                if(arr[i][j]===value){
                    return {i,j};
                }
            }
        }
        return null;
    }
    function isValidForSwap(blankCoord,buttonCoord){
        return Math.abs(blankCoord.i-buttonCoord.i)+Math.abs(blankCoord.j-buttonCoord.j)===1;
    }
    function swap(coord1,coord2,arr){
        [arr[coord1.i][coord1.j],arr[coord2.i][coord2.j]]=[arr[coord2.i][coord2.j],arr[coord1.i][coord1.j]];
      
    }

function isVictory(matrix){
    const arr=matrix.flat();
    for(let i=0;i<arr.length-1;i++){
        if(arr[i]!==i+1){
            return false;
        }
    }
    victory=true;
    return victory;
}

function audioWithPath(path){
    audio=new Audio();
    audio.src=path;
    audio.autoplay=true;
    return audio;
}

function createBtnAudio(audio){
    let btnStopMusik = document.createElement('button');
    btnStopMusik.setAttribute('id','pause');
    btnStopMusik.setAttribute('class','button active');
    btnStopMusik.textContent='Stop music';
    btnStopMusik.style.position='absolute';
    btnStopMusik.style.bottom='2rem';
    btnStopMusik.style.left='2rem';
     document.body.appendChild(btnStopMusik);
      btnStopMusik.addEventListener('click',()=>{
         btnStopMusik.classList.toggle('active');
         if(btnStopMusik.classList.contains('active')){
             audio.play();
             btnStopMusik.textContent='Stop music';
         }
         else {audio.pause();
             btnStopMusik.textContent='Play music';
         }
      });
}

function createElementImg(src){
    let img=document.createElement('img');
    img.src=src;
    img.width=100;
    img.height=100;
    return img;
}
