const containerNode=document.getElementById('fifteen');
const itemNodes=Array.from(containerNode.querySelectorAll('.item'));
const countItems=16;
const blankNumber=countItems;
let img = new Image();

    img.src ='d4.png';

    let ratio=img.width/img.height;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    let CELL_SIZE = 4;
    const puzzleWidth = canvas.width/4;
    const puzzleHeight = canvas.height/4;
    const imagePieceWidth = img.width / 4; // Ширина одного сектора изображения
    const imagePieceHeight = img.height / 4; // Высота одного сектора изображения
    itemNodes[countItems-1].style.display='none';
    let matrix=getMatrix(
    itemNodes.map((item)=>Number(item.dataset.matrixId)));
    img.onload = () => {
    //ctx.drawImage(img,400,400/ratio);
    img.width=400;
    img.height=400;
    setPositionItemsWithPicture(matrix,itemNodes);
    };

if(itemNodes.length!==countItems){
    throw new Error('Invalid number of items');
}
//setPositionItems(matrix,itemNodes);
//setPositionItemsWithPicture(matrix,itemNodes);

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
    
    
});

/* helpers */
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
        // console.log(
        //     `i:${i},j:${j},matrix[i][j]: ${matrix[i][j]} ,itemNode:${itemNode}`);
        
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
         //  console.log(itemNodeImg);
           const sizeMatrixCell=matrix[i].length;
            const itemNode=matrix[i][j];
            const srcCol= (itemNode - 1) % sizeMatrixCell;
            const srcRow= Math.floor((itemNode - 1) / sizeMatrixCell);


            // Координаты на canvas (назначение)
            const destX = j * puzzleWidth;//x*shiftPs %
            const destY = i * puzzleHeight;//y*shiftPs %
            
       if (itemNode !== blankNumber) {
        setNodesStyleWithPicture(srcCol,srcRow,destX,destY,itemNodeImg);
       }
       else {
    
        // Для пустого сектора делаем его белым

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(destX, destY, puzzleWidth, puzzleHeight);

        itemNodeImg.style.backgroundImage = "none";

    }
  
    }
    }
    }
    function setNodesStyleWithPicture(srcCol,srcRow,destX,destY,node){
    node.style.transform=`translate3D(${srcCol*puzzleWidth}%,${srcRow*puzzleHeight}%,0)`;
    ctx.clearRect(0,0,CELL_SIZE,CELL_SIZE);
    ctx.drawImage(
        img,
        srcCol*imagePieceWidth,  srcRow*imagePieceHeight,  
      imagePieceWidth,imagePieceHeight,                         // Координаты на canvas
           destX, destY,   
           puzzleWidth,puzzleHeight                           // Координаты на canvas       
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

    function drawPuzzle(state) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const value = state[row][col];

                if (value === 0) {
                    // Пропускаем пустую часть
                    ctx.fillStyle = "#000";
                    ctx.fillRect(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);
                    continue;
                }

                // Рассчитываем координаты сектора изображения (источник)
                const srcCol = (value - 1) % cols;
                const srcRow = Math.floor((value - 1) / cols);

                // Координаты на canvas (назначение)
                const destX = col * pieceWidth;
                const destY = row * pieceHeight;

                // Рисуем часть изображения
                ctx.drawImage(
                    img,
                    srcCol * pieceWidth, srcRow * pieceHeight, // Координаты начала сектора в изображении
                    pieceWidth, pieceHeight,                   // Размеры сектора в изображении
                    destX, destY,                              // Координаты на canvas
                    pieceWidth, pieceHeight                    // Размеры сектора на canvas
                );
            }
        }
    }
