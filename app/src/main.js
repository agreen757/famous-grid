/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View')
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier')
    var Transform = require('famous/core/Transform');
    var Lightbox = require('famous/views/Lightbox')
    var HFLayout = require('famous/views/HeaderFooterLayout')
    //enabling dragging things
    //var Draggable = require("famous/modifiers/Draggable");
    var LightBox = require('famous/views/Lightbox')
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var GridLayout = require('famous/views/GridLayout');
    var ScrollView = require('famous/views/Scrollview');
    var RenderNode = require('famous/core/RenderNode');
    var Transitionable = require("famous/transitions/Transitionable");
    var Easing = require('famous/transitions/Easing')
    var FastClick = require('famous/inputs/FastClick')
    //var hello = require('/../lib/hello/dist/hello.all.js')
    //var $
    
    //******************INPUT GOOGLE CREDS*****************
    //*****************************************************
    
    var clientObj = {
        id:"468772544188.apps.googleusercontent.com",
        secret:"LufQkK0YPcHbKetle54m8p2I"
    }
    
    //*****************************************************
    
    //*******initialize hello
    /*hello.init({
        google:'468772544188.apps.googleusercontent.com'
    },{redirect_uri:'http://localhost:3000/auth/callback'})
    //***********************
    
    hello.on('auth.login', function(auth){
        // call user information, for the given network
        hello( auth.network ).api( '/me' ).then( function(r){
            console.log(r)
            // Inject it into the container
            var label = document.getElementById( "profile_"+ auth.network );
            if(!label){
                label = document.createElement('div');
                label.id = "profile_"+auth.network;
                document.getElementById('profile').appendChild(label);
            }
            label.innerHTML = '<img src="'+ r.thumbnail +'" /> Hey '+r.name;
        });
    });
    
    */
    //***********************
    
    //Trying to have Divs snap back after we drag them
    
    /*var SnapTransition = require("famous/transitions/SnapTransition");
Transitionable.registerMethod('snap', SnapTransition);*/

    // create the main context
    var mainContext = Engine.createContext();
    
    var ss = mainContext.getSize();
    //var gwidth = ss[0] / 2.2
    var size = {}
    size.width = function(){
        return mainContext.getSize()[0]
    }
    size.height = function(){
        return mainContext.getSize()[1]
    }
    
    var viewSize = [undefined,300]
    
    var view = new View()
    var bottomModifier = new StateModifier({
      //origin: [0, 1],
      align: [0, 1]
    });
    var sizeModifier = new StateModifier({
        size: viewSize
    })
    var sizeNode = view.add(sizeModifier)
    
    var background = new Surface({
      properties: {
        backgroundColor: 'grey',
      }
    });
    var backModifier = new StateModifier({
      // positions the background behind the tab surface
      transform: Transform.behind
    });
    sizeNode.add(backModifier).add(background);

    // APP SECTION
    mainContext.setPerspective(1000);
    mainContext.add(bottomModifier).add(view)
    
    //TITLE TEXT
    var title = new Surface({
        content: "<h1>Login to get started</h1>",
        properties: {
            textAlign: "center",
            fontSize: "1.2em",
            fontFamily: "Helvetica, Arial, Sans-Serif"
        }
    })
    var titleModifier = new Modifier({
        origin: [0, 0],
        align: [.005,0]
    })
    var $ = window.jQuery;
    $('#loading').hide()
    mainContext.add(titleModifier).add(title)
    
    
    var login = new Surface({
        //need to add click events to this
        //try require hello.js up top and running the code back here
        content: "<div id='login'><p>Click to login</p></div>",
        size: [150,50],
        properties: {
            textAlign: "center",
            fontSize: "1.2em",
            'margin-top': '5em',
            'background-color':'#eee',
            'margin-right':'auto',
            'margin-left':'auto'
        }
    })
    
     var loginorigin = new StateModifier({
        origin: [0,1],
        align: [0,0.5]
    })
    mainContext.add(loginorigin).add(login)
    
    
    
    //*****************AUTHENTICATION SECTION***********
    //**************************************************
    login.on('click', function(){
        
        var url = 'https://accounts.google.com/o/oauth2/auth?client_id='+clientObj.id+'&redirect_uri=http%3A%2F%2Ffamous-grid-agreen757.c9.io%2Fauth%2Fcallback&scope=https://www.googleapis.com/auth/youtubepartner+https://www.googleapis.com/auth/yt-analytics.readonly&response_type=token'
        //var url = 'https://accounts.google.com/o/oauth2/auth?client_id='+clientObj.id+'&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fauth%2Fcallback&scope=https://www.googleapis.com/auth/youtubepartner+https://www.googleapis.com/auth/yt-analytics.readonly&response_type=token'
        
        window.location.replace(url)
    })
    
    //****************HANDLE RESPONSE - GET TOKEN
    //CHECK IF A HASH IS PRESENT
    if(window.location.hash){
        var token = window.location.hash.split('#').slice(1,2)[0].split('&')[0].split('=')[1]
        
        //**********************STORE VARIABLES*****************
        var gclaims = {};
        var geo = {};
        //******************************************************
        
        
        //**************GET THE SERVICE KEY TOKEN******
        var sToken;
        
        //console.log(data)
        $.ajax({
            method:'PUT',
            url: '/servicekey',
            success:function(r){
                console.log(r)
                sToken = r;
            }
        })
        //**********************************************    
          
        title.setContent('<h2>Loading channel info...<h2><br>')
        loginorigin.setOpacity(
            0,
            {curve: 'linear', duration : 500}
        );
        //mainContext.add(viewtrans).add(views)
        //mainContext.add(videotrans).add(videos)
        
        //do requests to return information
        var token = window.location.hash.split('#').slice(1,2)[0].split('&')[0].split("=")[1]
        var chanInfoUrl = 'https://www.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics%2CcontentDetails&mine=true&access_token='+token;
        //grab jquery from client instance
        
        $.get(chanInfoUrl, function(data,status){
            //console.log(data,status)
            this.data = data
            console.log(data)
            var foo = data.items[0];
            //***************CHANGE TITLE - SET DESCRIPTION AND PUBLISHED DATE
            title.setContent('<h2>'+foo.snippet.localized.title+'<h2>')
            
            //****************SHOW PUBLISHING INFORMATION
            var datepub = foo.snippet.publishedAt.split('T')[0]
            var pubsect = new Surface({
                content: 'Published: '+datepub,
                properties: {
                    textAlign: 'center',
                    'margin-top':'10px',
                    color:'white'
                }
            })
            var pubmod = new Modifier({
                origin: [0,-.08]
            })
            mainContext.add(pubmod).add(pubsect)
            
            pubsect.on('click',function(){
                //console.log('cliked')
            })
            
            //***********store all of our static values
            
            
            
            //******************TRANSITIONS
            var TRANSITION = {duration:500,curve:Easing.outElastic}
            //var transitionable = new Transitionable([145,100])
            var vidalign = new Transitionable([.28,0.5])
            var viewalign = new Transitionable([.75,0.5])
            var geoalign = new Transitionable([.28,0.5])
            var scorealign = new Transitionable([.75,.5])
            var geosize = new Transitionable([0,0])
            var viewsize = new Transitionable([0,0])
            var videosize = new Transitionable([0,0])
            var scoresize = new Transitionable([0,0])
            //**************************************
            
            
                //View statistic information SURFACE***********************
            var views = new Surface({
                //content: '<div><center><h2>View numbers</h2></center></div>',
                //size: [145,100],
                properties: {
                    'background-color': '#eee',
                    'paddingTop':'35px',
                    'fontSize':'1.5em',
                    'textAlign':'center'
                }
            })


            var viewtrans = new Modifier({
                origin: [.5, 0.5],
                align: function(){
                    return viewalign.get()
                },
                size: function(){
                    return viewsize.get()
                },
                textAlign: "center"
            })
            
            //**************GEOGRAPHIC INFORMATION
            //******************************************
            var geoSurface = new Surface({
                //content: '<div id="vid"><center><p>Geographic Breakdown</p></center></div>',
                //size:[145,100],
                properties: {
                    'background-color':'#eee',
                    'textAlign':'center',
                    'paddingTop':'35px',
                    'fontSize':'1.5em'
                }
            })
            var geoMod = new Modifier({
                origin: [.5,-1],
                size: function(){
                    return geosize.get()
                },
                align: function(){
                    return geoalign.get();
                }
            })
            
            //**************SCORE INFORMATIJON
            //***********************************
            
            var score = new Surface({
                properties: {
                    'background-color':'#eee',
                    'textAlign':'center',
                    'paddingTop':'40px',
                    fontSize:'3em',
                    'color':'blue'
                }
            })
            var scoreMod = new Modifier({
                origin: [.5,-1],
                size: function(){
                    return scoresize.get()
                },
                align: function(){
                    return scorealign.get()
                }
                
            })
            
            //transitionable.set(100,{duration:500,curve:'easeInOut'})
            //Video List SURFACE**************************************
            var videos = new Surface({
                //content: '<div id="vid"><center><p>Video Breakdown</p></center></div>',
                properties: {
                    'background-color': '#eee',
                    'textAlign':'center',
                    'paddingTop':'35px',
                    'fontSize':'1.5em'
                }
            })
            
            var vidVisible = false;
            var videotrans = new Modifier({
                origin: [.5, -3],
                //size: [145,100],
                size: function(){
                    return videosize.get();
                    
                },
                //align: [.28, 0.5],
                align: function(){
                    return vidalign.get();  
                },
                textAlign: "center"
            })
            
             //***************SHOW PROFILE INFORMATION
            var picture = foo.snippet.thumbnails.high.url
            var pic = new Surface({
                content:'<div><img height="80" width="80" src="'+picture+'"></div>',
                size: [100,100]
            })
            var picmod = new Modifier({
                origin: [.4, -1],
                align: [.51, 0.0],
                transform: Transform.scale(0, 0, 1)
            })
            mainContext.add(picmod).add(pic)
            picmod.setTransform(
                Transform.scale(1, 1, 1),
                { duration : 500, curve: Easing.outBack }
            );
            
            
            //************ADDING SURFACES TO THE PAGE************
            //***************************************************
            
            mainContext.add(viewtrans).add(views)
            mainContext.add(videotrans).add(videos)
            mainContext.add(geoMod).add(geoSurface)
            mainContext.add(scoreMod).add(score)
            
            var surfaceArray = [videotrans,geoMod,viewtrans,picmod,scoreMod]
            
            //************ADD CLICK CAPABILITY TO ALL SURFACES
            //************************************************
            
            //putting surfaces behind and in front
            function hider(b){
                surfaceArray.map(function(ele,index){
                    if(b != ele){
                        ele.setTransform(Transform.behind)
                    }
                    if(index = surfaceArray.length){
                        return;
                    }
                })
            }
            function shower(b){
                surfaceArray.map(function(ele,index){
                    if(b != ele){
                        ele.setTransform(Transform.inFront)
                    }
                    if(index = surfaceArray.length){
                        return;
                    }
                })
            }
            var lock = false
            videos.on('click', function(e){
                //console.log('clicked')
                
                //var lock = false;
                //console.log(gclaims)
                //console.log(lock)
                if(!lock){
                lock = true;
                var b = videotrans;
                if(!vidVisible){
                    if(gclaims.claimLength == undefined || gclaims.thirdPartyClaims == undefined){
                        var claims = "No Claim Info"
                        var thirdPartyClaims = "No Claim Info"
                    }
                    else{
                        var claims = gclaims.claimLength;
                        var thirdPartyClaims = gclaims.thirdPartyClaims;
                    }
                    hider(b)
                    vidVisible = true;
                    videosize.set([ss[0] / 1.1,ss[1] / 1.3],TRANSITION)
                    vidalign.set([0.5,0.5],TRANSITION,function(){
                        //console.log('unlocking')
                        lock = false
                    })
                    videos.setProperties({'paddingTop':'0px','fontSize':'1em'})
                    videos.setContent('<center><div><p id="score">'+claims+'</p><p>Claims on your channel</p></div></center><hr><center><div><p id="score">'+thirdPartyClaims+'</p><p>Videos/Assets currently in conflict</p></div></center>')
                }
                else{
                    vidVisible = false;
                    videosize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION)
                    vidalign.set([.28,0.5],TRANSITION,function(){
                        lock = false;
                    })
                    videos.setProperties({'paddingTop':'35px','fontSize':'1.5em'})
                    videos.setContent('Video Breakdown')
                    shower(b)
                }
                }
            })
            views.on('click',function(){
                
                if(!lock){
                    lock = true;
                
                var b = viewtrans;
                if(!vidVisible){
                    hider(b);
                    vidVisible = true;
                    viewsize.set([ss[0] / 1.1,ss[1] / 1.3],TRANSITION)
                    views.setProperties({'paddingTop':'0px','fontSize':'1em'})
                    views.setContent('<center><div><p id="score">'+viewCount+'</p><p>Views on your channel</p></div><div><p id="score">'+videoCount+'</p><p>Videos on your channel</p></div><div><p id="score">'+subs+'</p><p>Subscribers on your channel</p></div></center>')
                    viewalign.set([.5,0.5],TRANSITION,function(){
                        lock = false;
                    })
                }
                else{
                    vidVisible = false;
                    shower(b);
                    viewsize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                        lock = false
                    })
                    views.setProperties({'paddingTop':'35px','fontSize':'1.5em'})
                    views.setContent('Engagement Stats')
                    viewalign.set([.75,0.5])
                }
                }
            })
            
            var scrollview = new ScrollView();
            var surfaces =[]
            scrollview.sequenceFrom(surfaces)
            geoSurface.pipe(scrollview)
            geoSurface.on('click',function(){
                geoSurface.setProperties({'paddingTop':'0px','fontSize':'1em'})
                if(!lock){
                    lock = true    
                
                var b = geoMod
                if(!vidVisible){
                    vidVisible = true;
                    //videotrans.setTransform(Transform.behind)
                    hider(b)
                    geoMod.setOrigin([0.5,0.5])
                    geosize.set([ss[0] / 1.1,ss[1] / 1.3],TRANSITION,function(){
                        lock = false
                    })
                    geoalign.set([.5,0.53])
                    if(geo.states[0]){
                        var foo = geo.states[0].toString().split(',');
                        var state = foo[0]
                        var views = foo[1]
                        var estimatedMinutesWatched = foo[2]
                        var averageViewDuration = foo[3]   
                    }
                    var data = "";
                    data += '<center><div id="top">Your top 3 US states</div></center>'
                    if(geo.states.length >= 2){
                        geo.states.map(function(e,i){
                            //console.log(e[0])
                            data += '<center><p id="score">'+e[0]+'</p></center><div><center><table><tr><th>Views</th><th>Est min watch</th><th>Avg view dur.</th></tr><tr><td>'+e[1]+'</td><td>'+e[2]+'</td><td>'+e[3]+'</td></tr></table></center></div>'
                            if(i == geo.states.length - 1){
                                //console.log('done with map')
                                //console.log(data)
                                geoSurface.setContent(data)
                            }
                        })
                    }
                    else{
                      geoSurface.setContent('<p id="score">No geographic info</p>')
                    }
                    /*geoSurface.setContent('<center><div id="vid">Your top 5 states</div></center><center><p id="score">'+state+'</p></center><div><center><table><tr><th>Views</th><th>Est min watch</th><th>Avg view dur.</th></tr><tr><td>'+views+'</td><td>'+estimatedMinutesWatched+'</td><td>'+averageViewDuration+'</td></tr></table></center></div>')*/
                }
                else{
                    vidVisible = false;
                    shower(b)
                    geoMod.setOrigin([.5,-1])
                    geoalign.set([.28,0.5])
                    geoSurface.setProperties({'paddingTop':'35px','fontSize':'1.5em'})
                    geosize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                        lock = false
                    })
                    geoSurface.setContent('Geographic Breakdown')
                    
                    
                }
                //geoSurface.setContent('<div><center><p>Views: '+viewCount+'</p><p>Videos: '+videoCount+'</p><p>Subscribers: '+subs+'</p></center><div>')
                //viewalign.set([.28,0.5],TRANSITION)
                }
            })
            
            score.on('click',function(){
                //console.log(ss)
                var b = scoreMod;
                if(!lock){
                    lock = true    
                
                if(!vidVisible){
                    vidVisible = true;
                    hider(b)
                    scoreMod.setOrigin([0.5,0.5])
                    score.setProperties({'fontSize':'1em'})
                    scoresize.set([ss[0] / 1.1,ss[1] / 1.3],TRANSITION,function(){
                        lock = false
                    })
                    scorealign.set([.5,0.53])
                    score.setContent('Your score details')
                }
                else{
                    vidVisible = false;
                    shower(b)
                    scoreMod.setOrigin([.5,-1]);
                    scoresize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                        lock = false
                    })
                    scorealign.set([.75,.5])
                    score.setProperties({'fontSize':'3em'})
                    score.setContent('9.2/10')
                }
                }
            })
            
            
            
            
            
            //**************SHOW SURFACES AND POPULATE CONTENT FIELDS AFTER ANIMATION
            var viewCount = foo.statistics.viewCount
            var videoCount = foo.statistics.videoCount
            var subs = foo.statistics.subscriberCount
            //viewtrans.setOrigin([.5, 0.5],TRANSITION)
            videosize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                videos.setContent('Video Breakdown')
            })
            //console.log(ss)
            viewsize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                views.setContent('Engagement Stats')
            })
            videotrans.setOrigin([.5,0.5],TRANSITION,function(){
                geoSurface.setContent('Geographic Breakdown')
            })
            geosize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION)
            scoresize.set([ss[0] / 2.2,ss[1] / 5.2],TRANSITION,function(){
                score.setContent('9.2/10')
            })
            //views.setContent('<div><center><p>Views: '+viewCount+'</p><p>Videos: '+videoCount+'</p><p>Subscribers: '+subs+'</p></center><div>')
            
            
            
        })
        .then(function(data){
            var upPlaylist = data.items[0].contentDetails.relatedPlaylists.uploads
            var vidUrl = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid&maxResults=50&maxResults=50&playlistId="+upPlaylist+"&access_token="+token
            $.get(vidUrl,function(data,status){
                console.log(data)
                this.data = data;
            })
            .then(function(data){
                console.log('in claims with',data)
                var vidSilo = []
                data.items.map(function(ele,index){
                    vidSilo.push(ele.contentDetails.videoId)
                    if(index === data.items.length - 1){
                        //console.log(vidSilo.toString())
                        if(sToken != undefined){
                            var claimurl = "https://www.googleapis.com/youtube/partner/v1/claimSearch?includeThirdPartyClaims=true&videoId="+vidSilo.toString().split(',').join('%2C')+"&access_token="+sToken
                        $.get(claimurl, function(data,status){
                            console.log(data,status)
                            if(data.items){
                                var thirdPartyClaims = []
                                var claimLength = data.items.length
                                data.items.map(function(e,i){
                                    if(data.items[i].thirdPartyClaim){
                                        //  console.log(data.items[i].thirdPartyClaim)
                                        thirdPartyClaims.push(data.items.id);
                                    }
                                    if(i == data.items.length - 1){
                                        //console.log('at end of claims')
                                        gclaims.thirdPartyClaims = thirdPartyClaims.length;
                                        gclaims.claimLength = claimLength;
                                    }
                                })
                            }

                        })
                    }
                        else{
                            setTimeout(function(){
                                var claimurl = "https://www.googleapis.com/youtube/partner/v1/claimSearch?includeThirdPartyClaims=true&videoId="+vidSilo.toString().split(',').join('%2C')+"&access_token="+sToken
                            $.get(claimurl, function(data,status){
                            console.log(data,status)
                            if(data.items){
                                var thirdPartyClaims = []
                                var claimLength = data.items.length
                                data.items.map(function(e,i){
                                    if(data.items[i].thirdPartyClaim){
                                        //  console.log(data.items[i].thirdPartyClaim)
                                        thirdPartyClaims.push(data.items.id);
                                    }
                                    if(i == data.items.length - 1){
                                        //console.log('at end of claims')
                                        gclaims.thirdPartyClaims = thirdPartyClaims.length;
                                        gclaims.claimLength = claimLength;
                                    }
                                })
                            }

                        })
                            },1000)
                        }
                    }
                })
                    //console.log(data)
                    /*var claimurl = "https://www.googleapis.com/youtube/partner/v1/claimSearch?includeThirdPartyClaims=true&videoId="+vid.contentDetails.videoId+"&access_token="+token
                    $.get(claimurl, function(data,status){
                        //console.log(data,status)   
                    })*/
                /*data.items.map(function(vid){
                    console.log('in claims')
                    var claimurl = "https://www.googleapis.com/youtube/partner/v1/claimSearch?includeThirdPartyClaims=true&videoId="+vid.contentDetails.videoId+"&access_token="+token
                    $.get(claimurl, function(data,status){
                        console.log(data,status)   
                    })
                })*/
            }).then(function(){
                console.log('last function')
                var dateobj = {
                    thismonth : function(){
                        return new Date().toISOString().split('T')[0]
                    },
                    lastmonth : function(){
                        var x = new Date();
                        x.setDate(x.getDate()-30)
                        return x.toISOString().split('T')[0]
                        
                    }
                }
                //console.log(dateobj.thismonth())
                
                var geoUrl = 'https://www.googleapis.com/youtube/analytics/v1/reports?ids=channel%3D%3DMINE&start-date='+dateobj.lastmonth()+'&end-date='+dateobj.thismonth()+'&metrics=views%2CestimatedMinutesWatched%2CaverageViewDuration&dimensions=province&filters=country%3D%3DUS&sort=averageViewDuration&access_token='+token;
                    
                $.get(geoUrl).success(function(data,status){
                    console.log(data,status)
                    geo.states = []
                    if(data.rows){
                        data.rows.map(function(e,i){
                            if(i<=2){
                                geo.states.push(data.rows[i])
                            }
                        })
                    }
                })
            })
        })
    }
    
    //******************************************************
   
    
    var buttonActions = new Surface({
        content: "<button>Login</button>",
        size: [200,200]
    })
    
    var loginState = new StateModifier({
        transform: Transform.behind
    })
    
    //HEADER FOOTER LAYOUT
    
    var layout;
    
    createLayout();
    //addHeader();
    //addFooter();
    
    function createLayout() {
      layout = new HFLayout({
        headerSize: 100,
        footerSize: 50
      });

      mainContext.add(layout);
    }
    
    function addHeader() {
      layout.header.add(new Surface({
        properties: {
          backgroundColor: 'black',
          lineHeight: "100px",
          textAlign: "center"
        }
      }));
    }
    
    function addFooter() {
      layout.footer.add(new Surface({
        content: "Footer",
        properties: {
          backgroundColor: 'black',
          lineHeight: "50px",
          textAlign: "center"
        }
      }));
    }
    
    //mainContext.add(loginState).add(login)
    //mainContext.add(buttonActions)

});
