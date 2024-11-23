const containerNode=document.getElementById('fifteen');
const itemNodes=Array.from(containerNode.querySelectorAll('.item'));
const countItems=16;
const blankNumber=countItems;
let img = new Image();
   img.src = "src/img/zug.jpg";
   //img.src = "src/img/20240804_204500.jpg";
    let ratio=img.width/img.height;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    itemNodes[countItems-1].style.display='none';
    let matrix=getMatrix(
    itemNodes.map((item)=>Number(item.dataset.matrixId)));
    img.onload = () => {
   // ctx.drawImage(img,400,400/ratio);
    setPositionItemsWithPicture(matrix,itemNodes);
    };
    const puzzleWidth = canvas.width/4;
    const puzzleHeight = canvas.height/4;

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

function setPositionItemsWithPicture2(matrix,arr){
    for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
        let itemNodeImg=arr[matrix[i][j]-1];
         //  console.log(itemNodeImg);
           
            const itemNode=matrix[i][j];
            const srcCol = (itemNode - 1) % matrix[i].length;
            const srcRow = Math.floor((itemNode - 1) / matrix[i].length);

            // Координаты на canvas (назначение)
            const destX = j * puzzleWidth;//x*shiftPs %
            const destY = i * puzzleHeight;//y*shiftPs %
            
            // console.log(
            //     `srcCol:${srcCol},srcRow:${srcRow},destX:${destX},destY:${destY}
            //     i:${i},j:${j},matrix[i][j]: ${matrix[i][j]} ,itemNode:${itemNode}`);
            
          setNodesStyleWithPicture(srcCol,srcRow,destX,destY,itemNodeImg);
       
        
    }
    }
    }
function setNodesStyleWithPicture(srcCol,srcRow,destX,destY,node){
    node.style.transform=`translate3D(${srcCol*puzzleWidth}%,${srcRow*puzzleHeight}%,0)`;
    ctx.drawImage(
        img,
        srcCol * puzzleWidth, srcRow * puzzleHeight, // Координаты начала сектора в изображении
        puzzleWidth, puzzleHeight,                   // Размеры сектора в изображении
        destX, destY,                              // Координаты на canvas
        puzzleWidth, puzzleHeight              // Размеры сектора на canvas
    );
    node.style.backgroundImage=`url(${canvas.toDataURL()})`;
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



    function setPositionItemsWithPicture(matrix, arr) {

        const imagePieceWidth = img.width / 4; // Ширина одного сектора изображения
    
        const imagePieceHeight = img.height / 4; // Высота одного сектора изображения
    
    
    
        for (let i = 0; i < matrix.length; i++) {
    
            for (let j = 0; j < matrix[i].length; j++) {
    
                let itemNodeImg = arr[matrix[i][j] - 1];
    
    
    
                const itemNode = matrix[i][j];
    
                const srcCol = (itemNode - 1) % 4; // Позиция в исходном изображении (по горизонтали)
    
                const srcRow = Math.floor((itemNode - 1) / 4); // Позиция в исходном изображении (по вертикали)
    
    
    
                // Координаты на canvas (назначение)
    
                const destX = j * puzzleWidth; // Положение по горизонтали на canvas
    
                const destY = i * puzzleHeight; // Положение по вертикали на canvas
    
    
    
                if (itemNode !== blankNumber) {
    
                    ctx.drawImage(
    
                        img,
    
                        srcCol * imagePieceWidth, srcRow * imagePieceHeight, // Координаты начала сектора в изображении
    
                        imagePieceWidth, imagePieceHeight,                   // Размеры сектора в изображении
    
                        destX, destY,                                        // Координаты на canvas
    
                        puzzleWidth, puzzleHeight                            // Размеры сектора на canvas
    
                    );
    
    
    
                    // Устанавливаем фоновое изображение для HTML-узла
    
                    itemNodeImg.style.backgroundImage = `url(${canvas.toDataURL()})`;
    
                    itemNodeImg.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
    
                    itemNodeImg.style.backgroundPosition = `-${destX}px -${destY}px`;
    
                } else {
    
                    // Для пустого сектора делаем его белым
    
                    ctx.fillStyle = "#ffffff";
    
                    ctx.fillRect(destX, destY, puzzleWidth, puzzleHeight);
    
                    itemNodeImg.style.backgroundImage = "none";
    
                }
    
            }
    
        }
    
    }
    
    