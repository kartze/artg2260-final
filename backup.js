CanvasTexture = function(parentTexture) {
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._canvas.height = 1024;
        // The CanvasRenderingContext2D is an object that is used to issue 2D drawing commands to a canvas. It is obtained by passing '2d' to the HTMLCanvasElement.getContext() method.
        this._context2D = this._canvas.getContext("2d");
        if (parentTexture) {
          this._parentTexture.push(parentTexture);
          parentTexture.image = this._canvas;
        }
        var that = this;
        this._background = document.createElement("img");
        this._background.addEventListener("load", function(event) {
          that._canvas.width = that._background.naturalWidth;
          that._canvas.height = that._background.naturalHeight;
          that._crossRadius = Math.ceil(Math.min(that._canvas.width, that._canvas.height / 30));
          that._crossMax = Math.ceil(0.70710678 * that._crossRadius);
          that._crossMin = Math.ceil(that._crossMax / 10);
          that._crossThickness = Math.ceil(that._crossMax / 10);
          that._draw();
        }, false);
        this._background.crossOrigin = '';
        this._background.src = "textures/planets/earth_atmos_2048.jpg";
        this._draw();
      };
      CanvasTexture.prototype = {
        constructor: CanvasTexture,
        _canvas: null,
        _context2D: null,
        _xCross: 0,
        _yCross: 0,
        _xPrev: 512,
        _yPrev: 512,
        // here you can add something like xArray: [] and yArray: []
        // to store an array of start points instead of just one x and y 
        _i: 0,
        _crossRadius: 57,
        _crossMax: 40,
        _crossMin: 4,
        _crossThickness: 4,
        _parentTexture: [],
        addParent: function(parentTexture) {
          if (this._parentTexture.indexOf(parentTexture) === -1) {
            this._parentTexture.push(parentTexture);
            parentTexture.image = this._canvas;
          }
        },
        setCrossPosition: function(x, y) {

          this._xCross = x * this._canvas.width;
          this._yCross = y * this._canvas.height;
          this._draw();
        },
        _draw: function() {
          // unfortunately we can't use p5 here. However, we can use this: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D which contains very similar functions
          if (!this._context2D) return;
          // I removed this, this is like a background() function
          // this._context2D.clearRect(0, 0, this._canvas.width, this._canvas.height);
          
          // Background.
          // Here we only draw the world map for 10 frames, to make sure it loads, but not after that since we want to see the walkers rendered on top
          if (this._i < 10) {
            this._context2D.drawImage(this._background, 0, 0);
          }
          // Random walkers
          this._context2D.lineWidth = this._crossThickness;
          this._context2D.strokeStyle = "#FFFF00";
          // below is the main draw function. You can make this a for() loop to iterate over many walkers
          //for ( let i = 0; i < array.length; i++){
            // since we can't use p5, we'll just calculate x and y separately (without vectors)
            var xPos = this._xPrev + (Math.random() - 0.5) * 20;
            var yPos = this._yPrev + (Math.random() - 0.5) * 20;

            // drawing is more tedious without p5. we have to start a path, move it's start point, add a line, then apply a stroke to actually display it 
            this._context2D.beginPath();
            this._context2D.moveTo(this._xPrev, this._yPrev);
            this._context2D.lineTo(xPos, yPos);
            this._context2D.stroke();

            // update x and y to the new points
            this._xPrev = xPos;
            this._yPrev = yPos;

            // I wasn't sure what this part was for, but you're welcome to add it back
            // var r = random(100);
            // if (r < 1) {
            //   step.mult(random(25, 100));
            // } else {
            //   step.setMag(2);
            // }
          //}

          // refresh the texture 
          for (var i = 0; i < this._parentTexture.length; i++) {
            this._parentTexture[i].needsUpdate = true;
          }

          // count the frames
          this._i++;
        }
      }

      if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      var radius = 6371;
      var tilt = 0.41;
      var rotationSpeed = 0.02;
      // var cloudsScale = 1.005;
      // var moonScale = 0.23;
      var MARGIN = 0;
      var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
      var SCREEN_WIDTH  = window.innerWidth;
      var canvas, container, stats;
      var cubeTexture;
      var cam, controls, scene, renderer;
      var geometry, meshPlanet, meshClouds, meshMoon;
      var dirLight, ptLight, ambLight;
      var composer;
      var textureLoader = new THREE.TextureLoader();
      var d, dPlanet, dMoon, dMoonVec = new THREE.Vector3();
      var clock = new THREE.Clock();
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var onClickPosition = new THREE.Vector2();

      init();
      animate();

      function init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        cam = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
        cam.position.z = radius * 5;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
        controls = new THREE.FlyControls( cam );
        controls.movementSpeed = 200;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = false;
        dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -1, 0, 1 ).normalize();
        scene.add( dirLight );

        cubeTexture = new THREE.Texture(undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
        canvas = new CanvasTexture(cubeTexture);

        var materialNormalMap = new THREE.MeshPhongMaterial( {
          specular: 0x333333,
          shininess: 15,
          map: cubeTexture, 
          // textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
           specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
           normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
           normalScale: new THREE.Vector2( 0.85, 0.85 )
        } );
        // planet
        geometry = new THREE.SphereGeometry( radius, 100, 50 );
        meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
        meshPlanet.rotation.y = 0;
        meshPlanet.rotation.z = tilt;
        scene.add( meshPlanet );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        container.appendChild( renderer.domElement );
        //stats = new Stats();
        //container.appendChild( stats.dom );
        window.addEventListener( 'resize', onWindowResize, false );
        container.addEventListener('mousemove', onMouseMove, false);

        // postprocessing
        var renderModel = new THREE.RenderPass( scene, cam );
        var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
        effectFilm.renderToScreen = true;
        composer = new THREE.EffectComposer( renderer );
        composer.addPass( renderModel );
        composer.addPass( effectFilm );
      }

      function onWindowResize( event ) {
        SCREEN_HEIGHT = window.innerHeight;
        SCREEN_WIDTH  = window.innerWidth;
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        cam.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        cam.updateProjectionMatrix();
        composer.reset();
      }
      function animate() {
        requestAnimationFrame( animate );
        render();
        // stats.update();
      }
      function onMouseMove(evt) {
        //console.log('mouse move');
        evt.preventDefault();
        var array = getMousePosition(container, evt.clientX, evt.clientY);
        onClickPosition.fromArray(array);
        var intersects = getIntersects(onClickPosition, scene.children);
        if (intersects.length > 0 && intersects[0].uv) {
          var uv = intersects[0].uv;
          intersects[0].object.material.map.transformUv(uv);
          canvas.setCrossPosition(uv.x, uv.y);
        }
      }
      var getMousePosition = function(dom, x, y) {
        var rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
      };
      var getIntersects = function(point, objects) {
        mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);
        raycaster.setFromCamera(mouse, cam);
        return raycaster.intersectObjects(objects);
      };

      function render() {
        // rotate the planet 
        var delta = clock.getDelta();
        meshPlanet.rotation.y += rotationSpeed * delta;

        // slow down as we approach the surface
        dPlanet = cam.position.length();
        
        d = ( dPlanet - radius * 1.01 );

        controls.movementSpeed = 0.1 * d; // nathan changed from .33 to .1
        controls.update( delta );
        composer.render( delta );
      }