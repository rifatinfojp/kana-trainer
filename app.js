let pool=[]
let current=null

let stats={correct:0,wrong:0}

let progress=JSON.parse(localStorage.getItem("kanaProgress"))||{}

let timer
let time=10

function goHome(){

hideAll()
document.getElementById("home").classList.remove("hidden")

}

function hideAll(){

document.getElementById("home").classList.add("hidden")
document.getElementById("learn").classList.add("hidden")
document.getElementById("quizMenu").classList.add("hidden")
document.getElementById("quiz").classList.add("hidden")

}

function showLearn(){

hideAll()
document.getElementById("learn").classList.remove("hidden")

let grid=document.getElementById("learnGrid")

grid.innerHTML=""

kanaData.forEach(k=>{

let d=document.createElement("div")

d.innerHTML=k.kana+"<br>"+k.romaji

grid.appendChild(d)

})

}

function showQuizMenu(){

hideAll()
document.getElementById("quizMenu").classList.remove("hidden")

}

function startQuiz(type){

if(type==="hiragana") pool=kanaData.filter(k=>k.type==="hiragana")

if(type==="katakana") pool=kanaData.filter(k=>k.type==="katakana")

if(type==="combined") pool=[...kanaData]

hideAll()
document.getElementById("quiz").classList.remove("hidden")

nextQuestion()

}

function weight(k){

let p=progress[k.kana]||{c:0,w:0}

let score=p.w+1-(p.c*0.3)

if(p.c>=5) score*=0.2

return Math.max(score,0.1)

}

function pickKana(){

let weighted=[]

pool.forEach(k=>{

let w=weight(k)

for(let i=0;i<w*5;i++) weighted.push(k)

})

return weighted[Math.floor(Math.random()*weighted.length)]

}

function nextQuestion(){

current=pickKana()

document.getElementById("kana").textContent=current.kana

let options=[current.romaji]

while(options.length<4){

let r=pool[Math.floor(Math.random()*pool.length)].romaji

if(!options.includes(r)) options.push(r)

}

options.sort(()=>Math.random()-0.5)

document.querySelectorAll(".opt").forEach((b,i)=>{

b.textContent=options[i]

})

startTimer()

}

function startTimer(){

time=10

document.getElementById("timer").textContent=time

timer=setInterval(()=>{

time--

document.getElementById("timer").textContent=time

if(time<=0){

clearInterval(timer)

stats.wrong++

updateStats()

nextQuestion()

}

},1000)

}

function answer(btn){

clearInterval(timer)

let p=progress[current.kana]||{c:0,w:0}

if(btn.textContent===current.romaji){

stats.correct++
p.c++

}else{

stats.wrong++
p.w++

}

progress[current.kana]=p

localStorage.setItem("kanaProgress",JSON.stringify(progress))

updateStats()

setTimeout(nextQuestion,800)

}

function updateStats(){

document.getElementById("stats").textContent="Correct "+stats.correct+" | Wrong "+stats.wrong

}