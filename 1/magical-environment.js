class MagicalEnvironment
{
    constructor ()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.clock = new THREE.Clock();
        this.magicalElements = [];

        this.init();
    }

    init ()
    {
        // Setup renderer
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild( this.renderer.domElement );

        // Camera position
        this.camera.position.z = 15;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight( 0x112233, 0.5 );
        this.scene.add( ambientLight );

        // Add point lights
        this.createMagicalLights();

        // Create initial magical elements
        this.createMagicalElements();

        // Add event listeners
        this.addEventListeners();

        // Start animation
        this.animate();

        // Remove loading message
        const loading = document.getElementById( 'loading' );
        if ( loading ) loading.remove();
    }

    createMagicalLights ()
    {
        const lights = [
            { color: 0x7B2FFF, position: [ 5, 5, 5 ] },
            { color: 0x00FFE0, position: [ -5, -5, 5 ] },
            { color: 0xFF3366, position: [ 0, 5, -5 ] }
        ];

        lights.forEach( light =>
        {
            const pointLight = new THREE.PointLight( light.color, 1, 20 );
            pointLight.position.set( ...light.position );
            this.scene.add( pointLight );
        } );
    }

    createMagicalElements ()
    {
        // Create crystal geometries
        for ( let i = 0; i < 50; i++ )
        {
            const crystal = this.createCrystal();
            this.magicalElements.push( crystal );
            this.scene.add( crystal );
        }

        // Create magical particles
        this.particleSystem = this.createParticleSystem();
        this.scene.add( this.particleSystem );
    }

    createCrystal ()
    {
        const geometry = new THREE.OctahedronGeometry( Math.random() * 0.5 + 0.5 );
        const material = new THREE.MeshPhongMaterial( {
            color: new THREE.Color( Math.random(), Math.random(), 1 ),
            transparent: true,
            opacity: 0.7,
            shininess: 90
        } );

        const crystal = new THREE.Mesh( geometry, material );

        // Random position
        crystal.position.set(
            ( Math.random() - 0.5 ) * 20,
            ( Math.random() - 0.5 ) * 20,
            ( Math.random() - 0.5 ) * 20
        );

        // Add animation properties
        crystal.userData.rotationSpeed = Math.random() * 0.02;
        crystal.userData.floatSpeed = Math.random() * 0.01;
        crystal.userData.floatOffset = Math.random() * Math.PI * 2;

        return crystal;
    }

    createParticleSystem ()
    {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array( particleCount * 3 );
        const colors = new Float32Array( particleCount * 3 );

        for ( let i = 0; i < particleCount * 3; i += 3 )
        {
            // Position
            positions[ i ] = ( Math.random() - 0.5 ) * 20;
            positions[ i + 1 ] = ( Math.random() - 0.5 ) * 20;
            positions[ i + 2 ] = ( Math.random() - 0.5 ) * 20;

            // Color
            colors[ i ] = Math.random();
            colors[ i + 1 ] = Math.random();
            colors[ i + 2 ] = 1;
        }

        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

        const material = new THREE.PointsMaterial( {
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        } );

        return new THREE.Points( geometry, material );
    }

    addEventListeners ()
    {
        // Window resize
        window.addEventListener( 'resize', () =>
        {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        } );

        // Mouse movement for camera rotation
        document.addEventListener( 'mousemove', ( e ) =>
        {
            const rotX = ( e.clientY / window.innerHeight - 0.5 ) * Math.PI * 0.5;
            const rotY = ( e.clientX / window.innerWidth - 0.5 ) * Math.PI * 0.5;

            gsap.to( this.camera.rotation, {
                x: -rotX * 0.5,
                y: -rotY * 0.5,
                duration: 1
            } );
        } );

        // Spell buttons
        document.querySelectorAll( '.spell-button' ).forEach( button =>
        {
            button.addEventListener( 'click', () => this.castSpell( button.dataset.spell ) );
        } );
    }

    castSpell ( spellType )
    {
        switch ( spellType )
        {
            case 'portal':
                this.createPortalEffect();
                break;
            case 'crystals':
                this.createCrystalBurst();
                break;
            case 'temporal':
                this.createTemporalDistortion();
                break;
            case 'elements':
                this.createElementalSurge();
                break;
        }
    }

    createPortalEffect ()
    {
        const portalGeometry = new THREE.TorusGeometry( 2, 0.1, 16, 100 );
        const portalMaterial = new THREE.MeshPhongMaterial( {
            color: 0x00FFE0,
            emissive: 0x00FFE0,
            transparent: true,
            opacity: 0
        } );

        const portal = new THREE.Mesh( portalGeometry, portalMaterial );
        portal.position.z = -5;
        this.scene.add( portal );

        gsap.to( portalMaterial, {
            opacity: 0.7,
            duration: 1,
            yoyo: true,
            repeat: 1,
            onComplete: () => this.scene.remove( portal )
        } );
    }

    createCrystalBurst ()
    {
        for ( let i = 0; i < 10; i++ )
        {
            const crystal = this.createCrystal();
            crystal.scale.set( 0.1, 0.1, 0.1 );
            this.scene.add( crystal );

            gsap.to( crystal.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 1,
                ease: "back.out"
            } );

            gsap.to( crystal.position, {
                x: crystal.position.x * 2,
                y: crystal.position.y * 2,
                z: crystal.position.z * 2,
                duration: 2,
                ease: "power2.out"
            } );
        }
    }

    createTemporalDistortion ()
    {
        const intensity = { value: 0 };
        gsap.to( intensity, {
            value: 1,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            onUpdate: () =>
            {
                this.magicalElements.forEach( element =>
                {
                    element.position.multiplyScalar( 1 + intensity.value * 0.01 );
                } );
            }
        } );
    }

    createElementalSurge ()
    {
        const colors = [ 0xFF3366, 0x00FFE0, 0x7B2FFF, 0xFFFF00 ];
        colors.forEach( ( color, i ) =>
        {
            setTimeout( () =>
            {
                const light = new THREE.PointLight( color, 2, 10 );
                light.position.set(
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5
                );
                this.scene.add( light );

                gsap.to( light, {
                    intensity: 0,
                    duration: 1,
                    onComplete: () => this.scene.remove( light )
                } );
            }, i * 200 );
        } );
    }

    animate ()
    {
        requestAnimationFrame( () => this.animate() );

        const time = this.clock.getElapsedTime();

        // Animate crystals
        this.magicalElements.forEach( crystal =>
        {
            crystal.rotation.x += crystal.userData.rotationSpeed;
            crystal.rotation.y += crystal.userData.rotationSpeed * 0.8;
            crystal.position.y += Math.sin( time + crystal.userData.floatOffset ) * crystal.userData.floatSpeed;
        } );

        // Animate particles
        if ( this.particleSystem )
        {
            const positions = this.particleSystem.geometry.attributes.position.array;
            for ( let i = 0; i < positions.length; i += 3 )
            {
                positions[ i + 1 ] += Math.sin( time + positions[ i ] ) * 0.01;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render( this.scene, this.camera );
    }
}

// Initialize the magical environment
window.addEventListener( 'load', () =>
{
    const magicalEnv = new MagicalEnvironment();
} );