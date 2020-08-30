const express = require("express")
const fs = require("fs")
let app = express()
let path = require("path")
var index = 1
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000


app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname,"public/notes.html"))
})

app.get("/api/notes", function(req,result){
    fs.readFile("./db/db.json",function(err,res){
        if(err) throw err
        let myData = JSON.parse(res)
        return result.json(myData)
    })
})

app.post("/api/notes",function(req,res){
    fs.readFile("./db/db.json","utf8",function(err,result){
        if(err) throw err
        let myData = JSON.parse(result)
        let myNote = req.body
        if(myData.length > 0){
            index = myData[myData.length -1].id +1
            myNote.id = index
        }else{
            myNote.id = index
        }

       
        myData.push(myNote)
        fs.writeFile("./db/db.json",JSON.stringify(myData),function(error,readRes){
            if (err) throw err

            res.json(req.body)
        } )
    })

})

app.delete("/api/notes/:id",function(req,res){
    let myId = req.params.id;

    fs.readFile("./db/db.json","utf8",function(err,result){
        if(err) throw err
      
        let myData = JSON.parse(result)

        let indexToRemove = myData.map(function(note){
            return note.id}).indexOf(parseInt(myId))
            
            myData.splice(indexToRemove,1)
       
      
        fs.writeFile("./db/db.json",JSON.stringify(myData),function(error){
            if (error) throw err

            res.json(req.body)
        } )
    })
})



app.get("*", function(req,res){
    res.sendFile(path.join(__dirname,"public/index.html"))
})

app.listen(PORT, function(){
    console.log("Port: "+ PORT);
})