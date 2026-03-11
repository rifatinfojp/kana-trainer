self.addEventListener("install",e=>{

e.waitUntil(

caches.open("kana-cache").then(cache=>{

return cache.addAll([
"./",
"./index.html",
"./style.css",
"./app.js",
"./kana-data.js"
])

})

)

})