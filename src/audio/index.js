
// export class Audio extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//       return (<audio
//         controls
//         src="./../static/audio/stelar.mp3">
//             Your browser does not support the
//             <code>audio</code> element.
//     </audio>)
//   }
// }

export function addAudio(object, camera, audioUrl, callbak) {
    console.log("adding audio");
    console.log(audioUrl);
// create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );

// create the PositionalAudio object (passing in the listener)
    const sound = new THREE.PositionalAudio( listener );

// load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(audioUrl, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 20 );
        // if (play) sound.play();
        callbak();
    });

// finally add the sound to the mesh
    object.add( sound );
    return sound;
}

export function addAudioListener(camera, scene) {
    console.log("Adding audio listener");
        // instantiate a listener
    const audioListener = new THREE.AudioListener();

    // add the listener to the camera
    camera.add( audioListener );

    // instantiate audio object
    const oceanAmbientSound = new THREE.Audio( audioListener );

    // add the audio object to the scene
    scene.add( oceanAmbientSound );

    // instantiate a loader
    const loader = new THREE.AudioLoader();
    // load a resource
    loader.load(
        // resource URL
        './audio/stelar.mp3',

        // onLoad callback
        function ( audioBuffer ) {
            // set the audio object buffer to the loaded object
            oceanAmbientSound.setBuffer( audioBuffer );

            // play the audio
            oceanAmbientSound.play();
        },

        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function ( err ) {
            console.log( 'An error happened' );
        }
    );
}
