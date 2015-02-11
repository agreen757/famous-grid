/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
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
    
    //Trying to have Divs snap back after we drag them
    
    /*var SnapTransition = require("famous/transitions/SnapTransition");
Transitionable.registerMethod('snap', SnapTransition);*/

    // create the main context
    var mainContext = Engine.createContext();

    // APP SECTION
    mainContext.setPerspective(1000);
    
    
    //LOGO THAT WILL BE SPINNING
    var logo = new ImageSurface({
        size: [100, 100],
        content: '/content/images/famous_logo.png',
        classes: ['backfaceVisibility']
    });
    
    //TITLE TEXT
    var title = new Surface({
        content: "<h1>Famo.us Demo</h1>",
        properties: {
            textAlign: "center",
            fontSize: "1.2em",
            fontFamily: "Helvetica, Arial, Sans-Serif"
        }
    })
    
    //HEADER FOOTER LAYOUT
    
    var layout;
    
    createLayout();
    addHeader();
    addFooter();
    
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
          backgroundColor: 'gray',
          lineHeight: "100px",
          textAlign: "center"
        }
      }));
    }
    
    function addFooter() {
      layout.footer.add(new Surface({
        content: "Footer",
        properties: {
          backgroundColor: 'gray',
          lineHeight: "50px",
          textAlign: "center"
        }
      }));
    }
    
    var titleModifier = new Modifier({
        origin: [0, 0]
    })
    
    //DRAGGABLE PIECE 
    
    /*var draggable = new Draggable({
      xRange: [-220, 220],
      yRange: [-220, 220]
    });*/
    
    //GRID SECTION*****************************************************
    
    var grid = new GridLayout({
        dimensions: [2, 3],
        gutterSize: [5,0]
    })
    
    var surfaces = []
    
    var scrollView = new ScrollView({
        properties: {
            backgroundColor: 'green'
        }
    })
    
    grid.sequenceFrom(surfaces)
    
    //loop to make grid
    
    
    //FIRST LETS TRY TO ISOLATE THE SURFACE FUNCTION
    
    function newSurface(id){
        var surface = new Surface({
            content: ['I am panel '+id],
            size: [undefined, 100],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 24) + ", 100%, 50%)",
                color: "black",
                lineHeight: '100px',
                textAlign: 'center'
            }
        })
    }
    
    var gridModifier = new StateModifier({
        //THIS SECTION MODIFIES THE HEIGHT AND WIDTH OF THE ENTIRE GRID
        size: [300,300],
        origin: [.5, 0.5],
        align: [0.5, 0.5],
        //ADD THIS LINE TO SET THE ANIMATION ONLOAD - ALONG WITH THE SETTRANSFORM FUNCTION AT THE BOTTOM
        transform: Transform.scale(0, 0, 1),
    })
    
    var cmod = new StateModifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5]
    });
    var controller = new Lightbox({
      inTransition: true,
      outTransition: false,
      overlap: true
    });
    controller.hide();
    
    var showing;

    
    
    for(var i=0;i<6;i++){
        var tempSurface = new Surface({
            content: "I am panel " + (i + 1),
            size: [undefined, 100],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 24) + ", 100%, 50%)",
                color: "black",
                lineHeight: '100px',
                textAlign: 'center'
            }
        })
        
        var centerModifier = new StateModifier({
          origin: [0.5, 0.5],
          align: [0.5, 0.5]
        });
        
        tempSurface._smod = new StateModifier({
            size: [420,420],
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
          });
          tempSurface._rnode = new RenderNode();
          tempSurface._rnode.add(centerModifier)
          tempSurface._rnode.add(tempSurface._smod).add(tempSurface);
          
        
        tempSurface.on('click', function(context,e){
            
            if(this == showing){
                controller.hide({ curve:Easing.inElastic, duration: 500 }, function(){
                    gridModifier.setTransform(Transform.scale(1,1,1), 
                { curve:Easing.outElastic, duration: 1000 });
          });
                showing = null;
            }
            else{
                showing = this;
                gridModifier.setTransform(Transform.scale(0, 0.5, 0.001),
                                { curve:Easing.outCurve, duration: 300 });
              
              //SETTING THIS TRANSFORM TO 0,200 ENABLED ME TO MOVE THE PANEL THAT APPEARS WHEN CLICKED    
              cmod.setTransform(Transform.translate(0, 200, 0.0001));
              controller.show(this._rnode, { curve:Easing.outElastic, duration: 500 })
            }
            //console.log(this)
            //showing = this;
          
        }.bind(tempSurface, mainContext))
        
        //tempSurface.pipe(scrollView);
        //tempSurface.pipe(draggable);
        surfaces.push(tempSurface)
    }
    
    //******************************************************************
    

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        align: [0.5, 0.35],
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotateY(.002 * (Date.now() - initialTime));
        }
    });
    /*
    var firstDivModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
    })
    
    var firstDiv = new Surface({
        size: [200,200],
        properties: {
            background: "#eee"
        }
    })*/
    //mainContext.add(title)
    //mainContext.add(centerSpinModifier).add(logo);
    
    
    
    var renderNode = new RenderNode();
    renderNode.add(gridModifier).add(grid);
    renderNode.add(cmod).add(controller)
    //renderNode.add(title)
    //renderNode.add(centerSpinModifier).add(logo)
    scrollView.sequenceFrom([renderNode]);
    mainContext.add(scrollView);
    
    gridModifier.setTransform(
        Transform.scale(1, 1, 1),
        { duration : 1000, curve: Easing.inOutBack }
    );
});
