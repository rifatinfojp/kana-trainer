let pool=[]
let current=null

let progress=JSON.parse(localStorage.getItem("kanaProgress"))||{}

let stats={correct:0,wrong:0}

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
document.getElementById("analytics").classList.add("hidden")
document.getElementById("review").classList.add("hidden")

}

function showLearn(){

hideAll()
document.getElementById("learn").classList.remove("hidden")

let grid=document.getElementById("learnGrid")
grid.innerHTML=""

kanaData.forEach(k=>{

let p=progress[k.kana]||{c:0,w:0}

let star = p.c>=5 ? "⭐" : ""

let d=document.createElement("div")
d.innerHTML=k.kana+"<br>"+k.romaji+"<br>"+star

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

/* HARD CHARACTER AI */

function weight(k){

let p=progress[k.kana]||{c:0,w:0}

/*
AI formula
more wrong = higher weight
more correct = lower weight
*/

let score = (p.w+1) - (p.c*0.3)

/* mastered kana appear less */

if(p.c>=5) score*=0.2

return Math.max(score,0.1)

}

function pickKana(){

let weighted=[]

pool.forEach(k=>{

let w=weight(k)

for(let i=0;i<w*5;i++){
weighted.push(k)
}

})

return weighted[Math.floor(Math.random()*weighted.length)]

}

/* QUIZ */

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

/* TIMER */

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

/* ANSWER */

function answer(btn){

clearInterval(timer)

let feedback=document.getElementById("feedback")

let p=progress[current.kana]||{c:0,w:0}

if(btn.textContent===current.romaji){

stats.correct++
p.c++

btn.style.background="#22c55e"

feedback.innerHTML="<span class='correct'>Correct!</span>"

}else{

stats.wrong++
p.w++

btn.style.background="#ef4444"

feedback.innerHTML="<span class='wrong'>Wrong! Correct: "+current.romaji+"</span>"

}

progress[current.kana]=p

localStorage.setItem("kanaProgress",JSON.stringify(progress))

updateStats()

setTimeout(()=>{

feedback.innerHTML=""

document.querySelectorAll(".opt").forEach(b=>{
b.style.background=""
})

nextQuestion()

},1200)

}

/* STATS */

function updateStats(){

document.getElementById("stats").textContent=
"Correct "+stats.correct+" | Wrong "+stats.wrong+" | Mastered "+masteredCount()

}

function masteredCount(){

let count=0

Object.values(progress).forEach(p=>{
if(p.c>=5) count++
})

return count

}

/* ANALYTICS */

function showAnalytics(){

hideAll()
document.getElementById("analytics").classList.remove("hidden")

let map=document.getElementById("heatmap")
map.innerHTML=""

kanaData.forEach(k=>{

let p=progress[k.kana]||{c:0,w:0}

let color="red"

if(p.c>=5) color="blue"
else if(p.c>=3) color="green"
else if(p.c>=1) color="yellow"
else if(p.w>=2) color="orange"

let d=document.createElement("div")

d.className="heat "+color
d.textContent=k.kana

map.appendChild(d)

})

}

/* REVIEW PAGE */

function showReview(){

hideAll()
document.getElementById("review").classList.remove("hidden")

let list=document.getElementById("wrongList")
list.innerHTML=""

Object.entries(progress).forEach(([kana,data])=>{

if(data.w>2){

let d=document.createElement("div")
d.innerText=kana+" wrong: "+data.w

list.appendChild(d)

}

})

}

/* PRACTICE WEAK */

function practiceWeak(){

pool=kanaData.filter(k=>{

let p=progress[k.kana]

return p && p.w>2

})

hideAll()
document.getElementById("quiz").classList.remove("hidden")

nextQuestion()

}
