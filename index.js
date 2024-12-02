const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnSelect = document.querySelector(".btnSelect");
let start=document.getElementById('start');
const timeEl=document.getElementById('time');
const containerNode=document.getElementById('fifteen');
const inpImg=document.getElementById('inpImg');
const imgSelect=document.getElementById('imgSelect');
const imgList=document.getElementById('imgList');

let pause=document.getElementById('pause');
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
    }
   
  if(imgArr.length>0){
    img.src=imgArr[0].src;
    img.addEventListener('load',()=>{
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    setPositionItemsWithPicture(matrix,itemNodes);} );
  }
    btnSelect.textContent ='Click on the selected image';
    
});

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