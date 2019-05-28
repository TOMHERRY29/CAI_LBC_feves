var express = require('express');
var hostname = 'localhost'; 
var port = 3000; 
var mongoose = require('mongoose'); 
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
var urlmongo = "mongodb://localhost:27017/feves"; 
mongoose.connect(urlmongo, options);
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
}); 
var app = express(); 
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('CAI_LBC_feves'));

var feveSchema = mongoose.Schema({
    image: String,
    nom: String, 
    prenom: String, 
    lieu: String, 
    prix: String,
    vendeur : String,
    email : String,
    message : String   
}); 
var Feves = mongoose.model('Feves', feveSchema); 
var myRouter = express.Router(); 
myRouter.route('/')
.all(function(req,res){ 
      res.json({message : "Bienvenue sur notre Base de données Feves ", methode : req.method});
});
  
myRouter.route('/feves')
.get(function(req,res){ 
	Feves.find(function(err, feves){
        if (err){
            res.send(err); 
        }
        res.json(feves);  
    }); 
})
.post(function(req,res){
    var feve = new Feves();
    console.log(req.body);
    feve.image = req.body.image;
    feve.nom = req.body.nom;
    feve.prenom = req.body.prenom;
    feve.lieu = req.body.lieu;
    feve.prix = req.body.prix;
    feve.vendeur = req.body.vendeur;
    feve.email = req.body.email;
    feve.message = req.body.message; 
    feve.save(function(err){
        if(err){
        res.send(err);
        }
        res.json({message : 'Bravo, l article est maintenant stockée en base de données'});
        //window.location.replace("index.html");
    }); 
}); 
 
myRouter.route('/feves/:feves_id')
.get(function(req,res){ 
            Feves.findById(req.params.feves_id, function(err, feve) {
            if (err)
                res.send(err);
            res.json(feve);
        });
})
.put(function(req,res){ 
                Feves.findById(req.params.feves_id, function(err, feve) {
                if (err){
                    res.send(err);
                }
                feve.image = req.body.image;
                feve.nom = req.body.nom;
                feve.prenom = req.body.prenom;
                feve.lieu = req.body.lieu;
                feve.prix = req.body.prix;
                feve.vendeur = req.body.vendeur;
                feve.email = req.email;
                feve.message = req.message;  
                feve.save(function(err){
                    if(err){
                        res.send(err);
                    }
                    res.json({message : 'Bravo, mise à jour des données OK'});
                });                
    });
})
.delete(function(req,res){ 
 
    Feves.remove({_id: req.params.feves_id}, function(err, feve){
        if (err){
            res.send(err); 
        }
        res.json({message:"Bravo, article supprimé"}); 
    }); 
    
});
app.use(myRouter);   
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});
