let pool=[]
let current=null

let progress=JSON.parse(localStorage.getItem("kanaProgress"))||{}

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

function weight(k){

let p=progress[k.kana]||{c:0,w:0}

let score=(p.w+1)-(p.c*0.3)

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

}

function answer(btn){

let p=progress[current.kana]||{c:0,w:0}

if(btn.textContent===current.romaji){

p.c++
document.getElementById("feedback").innerHTML="Correct!"

}else{

p.w++
document.getElementById("feedback").innerHTML="Wrong! Correct: "+current.romaji

}

progress[current.kana]=p

localStorage.setItem("kanaProgress",JSON.stringify(progress))

setTimeout(()=>{

document.getElementById("feedback").innerHTML=""
nextQuestion()

},1000)

}

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

function practiceWeak(){

pool=kanaData.filter(k=>{

let p=progress[k.kana]

return p && p.w>2

})

hideAll()
document.getElementById("quiz").classList.remove("hidden")

nextQuestion()

}
