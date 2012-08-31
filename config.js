module.exports = function(app, express, io){

  var config = this;

  //generic config
  app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'c4SDGm$s51as)4_59f' }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/client'));

  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    io.set('log level', 2);
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    io.set('log level', 1);
  });

  return config;

};