let gameName = 'Guess Name';
let date = Date()
document.title = gameName;
document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} created by  &copy NAGIUB  2024`;
 

// Options
let numberofTries   = 6,
    numberofLetters = 6,
    currentTry      = 1,
    message=document.querySelector('.message'),
    wordToGuess = "";
const words = ["create" , "update" , "delete","try" , "game" , "done" ,"Elzero" , "nice","Count" , "Good" , "Modify","Letter"];
wordToGuess = words[Math.floor(Math.random()*words.length)].toLowerCase();
numberofLetters = wordToGuess.length
let generateInputs = () =>{
    // create Main try Div
    const inputsContainer = document.querySelector('.inputs');
    for(let i = 1 ; i<= numberofTries ; i++){
        const tryDiv = document.createElement('div');
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i != currentTry ) tryDiv.classList.add('disabled-inputs')
        // create Inputs in try Div
        for(let j=1;j<=numberofLetters;j++){
            const input = document.createElement('input');
            input.type='text';
            input.id=`guess-${i}-letter-${j}`;
            input.setAttribute('maxlength' , "1");
            tryDiv.appendChild(input)
        }


        // Add TryDiv to div.inputs
        inputsContainer.appendChild(tryDiv);
    }
    // Auto Fucos of first input
    inputsContainer.children[0].children[1].focus();
    // Disable all inputs except first one
    const inputsDisabled = document.querySelectorAll('.disabled-inputs input');
    inputsDisabled.forEach((inp)=>(inp.disabled = true))
    // Focus on next inputs 
    const inputs = document.querySelectorAll('input');
    inputs.forEach((inp,index)=>{
        inp.addEventListener("input",function(){ 
            this.value = this.value.toUpperCase(); // because of this we can't use arrow function
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        // navigate between inputs with arrows
        inp.addEventListener("keydown" , function(event){
            const currentIndex = Array.from(inputs).indexOf(event.target); // or (this)
            if(event.key === "ArrowRight"){
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus()
            }
            if(event.key === "ArrowLeft"){
                const prevInput = currentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus()
            }
        })
    });


    
}

// Handle Logic Game
const guessBtn = document.querySelector('.check');
guessBtn.addEventListener("click" ,handleGuessing)

function handleGuessing(){
    let success = true;
    for(let i =1 ; i <= numberofLetters ; i++){
        const inpField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inpField.value.toLowerCase();
        const actualLetter = wordToGuess[i-1];
        if(letter === actualLetter){
            inpField.classList.add('correct');
        } else if( wordToGuess.includes(letter) && letter !=="" ){
            inpField.classList.add('correct-not-place');
            success = false;
        }else{
            inpField.classList.add('wrong');
            success=false;
        }

    }


    if(success){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You Did It !",
            showConfirmButton: false,
            timer: 1500
          });
        message.innerHTML = `You win The Word Is <span> ${wordToGuess}</span>`;
        // Disable All
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv)=>tryDiv.classList.add("disabled-inputs"))
        guessBtn.disabled = true;
    }else{
        if(currentTry < 6){
            currentTry++
            nextTry()
        }else{
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Sorry Good Luck Next Time!",
                showConfirmButton: false,
                timer: 1500
              });
            let allTries = document.querySelectorAll(".inputs > div");
            allTries.forEach((tryDiv)=>tryDiv.classList.add("disabled-inputs"))
            guessBtn.disabled = true;
            message.innerHTML = `You Lose The Word Is <span> ${wordToGuess}</span>`;
        }
    }
}
let nextTry = () =>{

    const allTries = document.querySelectorAll(".inputs > div");
    // Disable all inputs except current try and disable inputs
    allTries.forEach((tryDiv)=>tryDiv.classList.contains(`try-${currentTry}`) ?
        (tryDiv.classList.remove('disabled-inputs'),document.querySelectorAll(`.try-${currentTry} input`).forEach((inp) =>(inp.disabled=false)) , tryDiv.children[1].focus()) :
        (tryDiv.classList.add('disabled-inputs') ,  document.querySelectorAll(`.disabled-inputs input`).forEach((inp) =>(inp.disabled=true)))
      )
}
let hintCount = 2
const hintBtn = document.querySelector('.hint');
document.querySelector('.hint span').innerHTML = hintCount;
let hint = () =>{

        let index = Math.floor(Math.random()*wordToGuess.length)
        let hintLetter = wordToGuess[index].toUpperCase(); // hintLetter
        let inpField =  document.querySelectorAll(`.try-${currentTry} > input`)[index]
        inpField.value = hintLetter;
        inpField.classList.add('correct');
        hintCount--
        document.querySelector('.hint span').innerHTML = hintCount;
        if(hintCount ==0){
            hintBtn.disabled =true
        }
}
hintBtn.addEventListener("click" ,hint)

window.onload = function(){
    generateInputs();
}