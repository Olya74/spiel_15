let header=document.querySelector('.header');
let src=window.localStorage.getItem('img');
let imgArrLocalSrc=[];
let imgArrSrc=JSON.parse(localStorage.getItem('imgArrLocalSrc'));
header.style.boxShadow='inset 0 0 0.8rem  #da1939fa';
const h2=document.createElement('h2');
h2.style.margin='0.5rem auto';
h2.textContent='My puzzle';
header.append(h2);
header.style.display='flex';
header.style.alignItems='center';
header.style.flexDirection='column';
header.style.position='absolute';
header.style.top='0';
header.style.right='0';
try{
    if(imgArrSrc){
        console.log('4',imgArrSrc);
        
            imgArrSrc.forEach((src)=>{
            let imgNode=document.createElement('img');
            imgNode.width=200;
            imgNode.height=200;
            imgNode.setAttribute('alt','my saved image ');
            imgNode.style.margin='0.5rem';
                console.log('4',src);
                imgNode.src=src;
                header.append(imgNode);   
        });
    }
}
catch(e){
    console.log('my',e);
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const myCanvas=document.getElementById('myCanvas');
const myCtx=myCanvas.getContext('2d');
const btnSelect = document.querySelector(".btnSelect");
let start=document.getElementById('start');
const timeEl=document.getElementById('time');
const containerNode=document.getElementById('fifteen');
const inpImg=document.getElementById('inpImg');
const imgSelect=document.getElementById('imgSelect');
const imgList=document.getElementById('imgList');
let pause=document.getElementById('pause');
window.localStorage.setItem('data','data');
let data=window.localStorage.getItem('data');
console.log(data);

const init = function () {
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 1;
    isPlaying = true;
    score1.textContent = 0;
    score2.textContent = 0;
    current1.textContent = 0;
    current2.textContent = 0;
  
    diceEl.classList.add("hidden");
    player1.classList.remove("player--winner");
    player2.classList.remove("player--winner");
    player2.classList.remove("player--active");
    player1.classList.add("player--active");
  };
  //init();
  
let audio=new Audio();
let img = new Image();
img.src ='img/zug.jpg';
let imgArr=[];
canvas.width = 400;
canvas.height = 400;
let CELL_SIZE = 4;
const itemNodes=Array.from(containerNode.querySelectorAll('.item'));
const countItems=16;
if(itemNodes.length!==countItems){
    throw new Error('Invalid number of items');
}
itemNodes[countItems-1].style.display='none';
let matrix=getMatrix(
itemNodes.map((item)=>Number(item.dataset.matrixId)));

const puzzleWidth = canvas.width/CELL_SIZE;
const puzzleHeight = canvas.height/CELL_SIZE;
const blankNumber=countItems;
const imagePieceWidth = img.width / CELL_SIZE; 
const imagePieceHeight = img.height / CELL_SIZE; 

img.addEventListener('load',()=>{
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    setPositionItemsWithPicture(matrix,itemNodes);
});


let isPaused=false;
let victory=false;
let unvictory=false;
let game=true;
let startMinutes = 0.25;
let time=startMinutes*60;
let idTimer ;
start.addEventListener('click',()=>{
  idTimer = setInterval(updateTimer,1000);
  start.setAttribute('disabled','disabled');
  start.style.opacity=0.6;
});
pause.addEventListener('click',()=>{
    isPaused=!isPaused;
    if(isPaused){
        pause.textContent='continue';
        pause.style.opacity=0.6;
    }
    else{
        pause.textContent='Pause';
    }
});
let imgALL=document.querySelectorAll('img');
imgALL.forEach((imgA)=>{
    imgA.addEventListener('click',(e)=>{
        imgA.src=e.target.src;
        if(imgA.src){
            img.src=imgA.src;
        console.log('999',img.src);
    }
       
        
    });
}
);


imgList.addEventListener('click',(e)=>{
    const imgNode=e.target.closest('img');
    if(imgNode){
        img.src = imgNode.src;
           setPositionItemsWithPicture(matrix,itemNodes);
           }
});

imgSelect.addEventListener('click',(e)=>{
    if(inpImg){inpImg.click();}
    e.preventDefault();   //prevent navigation to #
},false);

inpImg.addEventListener('change',(e)=>{
    
    const list=document.createElement('ul'); 
    imgList.appendChild(list);
    let URL=window.webkitURL || window.URL;
    let files=e.target.files;
   
    for(let i=0;i<files.length;i++){
        let myImg=new Image();
       const li=document.createElement('li');
          list.appendChild(li);
            myImg.width=100;
            myImg.height=100;
            myImg.src=URL.createObjectURL(files[i]);
            li.appendChild(myImg);
            imgArr.push(myImg);
            imgArrLocalSrc.push(myImg.src);
            URL.revokeObjectURL(files[i]);
    }
   if(imgArrLocalSrc.length>0){
    try{
        window.localStorage.setItem('imgArrLocalSrc',JSON.stringify(imgArrLocalSrc));
    }catch(e){
        console.log('my',e);
        if(e==QUOTA_EXCEEDED_ERR){
            console.log('Local storage is full');
        }
    }
   
   }
  if(imgArr.length>0){
    img.src=imgArr[0].src;
    img.addEventListener('load',()=>{
    ctx.drawImage(img,0,0,canvas.width,canvas.height);

    canvas.toBlob(function(blob){

        let link=document.createElement('a');
        link.href=URL.createObjectURL(blob);
        link.download='imgBlob.png';
        link.click();
        URL.revokeObjectURL(link.href);}, 'image/png');




    setPositionItemsWithPicture(matrix,itemNodes);} );
    }
    btnSelect.textContent ='Click on the selected image';
    
});
// console.log('2',JSON.parse(localStorage.getItem('imgArrLocalSrc')));
document.getElementById('shuffle').addEventListener('click',()=>{
    matrix=getMatrix(shuffleArray(matrix));
    setPositionItems(matrix,itemNodes);
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
      audio = audioWithPath('img/victory.mp3');
        createBtnAudio(audio);
        alert('Victory');
    }
});


/* helpers */

function setTimerStyle(){
    timeEl.style.backgroundColor='black';
    timeEl.style.color='white';
    timeEl.style.fontSize='2rem';
    timeEl.style.textAlign='center';
    timeEl.style.display='inline-block';
    timeEl.style.padding='0.5rem 3rem';
    timeEl.style.borderRadius='0.5rem';
    timeEl.style.boxShadow='0 0 0.8rem  #da1939fa';
    timeEl.previousSibling.textContent='Time has begun: ';
}

function updateTimer(){
   
    if(!isPaused){
    let minutes=Math.floor(time/60);
    let seconds=time%60;
    seconds=seconds<10?'0'+seconds:seconds;
    minutes=minutes<10?'0'+minutes:minutes;
    timeEl.innerHTML=`${minutes}:${seconds}`;
    setTimerStyle();
    time--;
    }
    if(time < 0){
        unvictory=true;
        clearInterval(idTimer);
        audio = audioWithPath('img/ups.mp3');
        resetTimer();
    }
   
}
function resetTimer(){
    time=startMinutes*60;
    timeEl.innerHTML='';
    timeEl.previousSibling.textContent='You have 15 minutes';
    timeEl.style.display='none';
    start.removeAttribute('disabled');
    start.style.opacity=1;
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
        ctx.fillStyle = "white";
        ctx.fillRect(destX, destY, puzzleWidth, puzzleHeight);
        itemNodeImg.style.backgroundImage = "none";

    }
  
    }
    }
    }
    function setNodesStyleWithPicture(srcCol,srcRow,destX,destY,node){
    node.style.transform=`translate3D(${srcCol*puzzleWidth}%,${srcRow*puzzleHeight}%,0)`;
    ctx.clearRect(0,0,CELL_SIZE,CELL_SIZE);
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
    btnStopMusik.style.bottom='7rem';
    btnStopMusik.style.right=0;
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

let value=1;
// function draw(){
//     for(let i=0;i<myCanvas.height;i+=50){
//         for(let j=0;j< myCanvas.width;j+=50){
//             myCtx.fillStyle='red';
//             myCtx.fillRect(i+2,j+2,45,45);
//             myCtx.fillStyle='black';
//                     myCtx.font='20px Arial';
//                     myCtx.fillText(value,i+20,j+30);
//                     value++;
//         }
      
//     }
    
// }
// draw();



function shuffleArray(array){
    let newArr=array.flat();
    for(let i=newArr.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [newArr[i],newArr[j]]=[newArr[j],newArr[i]];
    }
    return newArr;
}