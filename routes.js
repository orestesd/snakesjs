module.exports = function(app){


  app.get('/', function(req, res){
    
    res.writeHead(302, {
      'Location': 'snakejs.html'
    });
    
    res.end();
  });

};  