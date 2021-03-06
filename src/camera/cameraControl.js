import TWEEN from 'tween.js';

import AnimateAlongSpline from './animations/animateAlongSpline';

class CameraControl {
  constructor(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.cameraTween = null;
    this.cameraFocus = null;

    this.isAnimating = false;

    this.allowOverwrite = true;

    this.centerCam = null;
    this.posCamera = null;

    this.followTarget = null;
    this.movementType = 'cut'; // or 'track'

    this.trackSpeed = {t:0.01};

  }

  pause() {
    if (this.cameraTween && this.cameraFocus) {
      this.cameraTween.stop();
      this.cameraFocus.stop();
      this.isAnimating = false;
    }
  }

  resume() {
    if (this.cameraTween && this.cameraFocus) {
      this.cameraTween.start();
      this.cameraFocus.start();
      this.isAnimating = true;
    }
  }

  stop() {
    if (this.cameraTween && this.cameraFocus) {
      this.cameraTween.stop();
      this.cameraFocus.stop();
      this.cameraTween = null;
      this.cameraFocus = null;
      this.centerCam = null;
      this.posCamera = null;
      this.isAnimating = false;
    }
  }

  zoom(zoomDistance, direction, transition_speed) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    switch (direction) {
      case 'in':
        this.zoomDistance = -Math.abs(zoomDistance);
        break;
      case 'out':
        this.zoomDistance = Math.abs(zoomDistance);
        break;
    }

    this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(0, this.zoomDistance, 0)), new THREE.Vector3(0, 0, 0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(0, this.zoomDistance, 0)),
	      	duration: this.transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out,
	    });
  }

  pan(panDistance, direction, transition_speed) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    switch (direction) {
      case 'left':
        panDistance = Math.abs(panDistance);
        break;
      case 'right':
        panDistance = -Math.abs(panDistance);
        break;
    }

    this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(0, 0, panDistance)), new THREE.Vector3(0, 0, 0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(0, 0, panDistance)),
	      	duration: transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out,
	    });
  }

  push(pushDistance, direction, transition_speed) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    switch (direction) {
      case 'in':
        pushDistance = -Math.abs(pushDistance);
        break;
      case 'out':
        pushDistance = Math.abs(pushDistance);
        break;
    }

	    this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(pushDistance, 0, 0)), new THREE.Vector3(0, 0, 0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(pushDistance, 0, 0)),
	      	duration: transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out,
	    });
  }

  fly_to(targetPos, offset, lookAt, easing, type, transition_speed, arcHeight, callback) {
    if (this.isAnimating && !this.allowOverwrite) {
      return false;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    // to prevent shaking camera bug
    const dTo = this.camera.position.clone().distanceTo(targetPos.clone().add(offset));
    if (dTo < 1) {
      this.stop();
      return false;
    }

    this.followTarget = null;

    switch (type) {
      case 'direct':
        this.fly_direct(
          targetPos, offset, lookAt, {
              focus: targetPos,
              duration: transition_speed,
              easing,
          },
          callback,
        );
        break;
      case 'top':
        this.fly_direct(
          targetPos, offset, lookAt, {
              focus: targetPos,
              duration: transition_speed,
              easing,
          },
          callback,
        );
        break;
      case 'front':
        this.fly_direct(
          targetPos, offset, lookAt, {
              focus: targetPos,
              duration: transition_speed,
              easing,
          },
          callback,
        );
        break;
      case 'path':
        this.fly_arc(
          targetPos, offset, lookAt, {
              arcHeight,
            visible: false,
            focus: targetPos,
            duration: transition_speed,
            easing,
          },
          callback,
        );
        break;
    }
  }

  fly_direct(targetPos, offset, lookAt, params, callback) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    const scope = this;
    scope.posCamera = scope.controls.object.position.clone();

    // camera location
    this.cameraTween = new TWEEN.Tween(scope.posCamera)
      .to(targetPos.clone().add(offset), params.duration)
      .onUpdate(() => {
        // scope.controls.object.up.x = -1;
        // scope.controls.object.up.z = 0;
        scope.controls.object.position.copy(scope.posCamera);
        scope.isAnimating = true;
      })
      .easing(params.easing)
      .onComplete(() => {
        scope.isAnimating = false;
        scope.cameraTween = null;
        callback();
      })
      .start();

    // camera focus
    scope.centerCam = scope.controls.target.clone();
    this.cameraFocus = new TWEEN.Tween(scope.centerCam)
      .to(params.focus, params.duration)
      .onUpdate(() => {
        scope.controls.target.copy(scope.centerCam);
        scope.isAnimating = true;
      })
      .easing(params.easing)
      .onComplete(() => {
        scope.isAnimating = false;
        scope.cameraFocus = null;
      })
      .start();
  }

  fly_arc(targetPos, offset, lookAt, params, callback) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    console.log('Switching camera position...');

    const scope = this;
    this.isAnimating = true;

    const animateAlongSpline = new AnimateAlongSpline(
      this.scene,
      this.controls,
      this.controls.object,
      this.controls.object.position.clone(),
      // new THREE.Vector3().setFromMatrixPosition( this.controls.object.matrixWorld ),
      targetPos.clone().add(offset),
      lookAt,
      params,
    )
      .onComplete(() => {
        scope.isAnimating = false;
        scope.cameraTween = null;
        scope.cameraFocus = null;
        callback();
      })
      .start();
  }

  jump(position, look) {
    if (this.isAnimating && !this.allowOverwrite) {
      return;
    } else if (this.allowOverwrite) {
      this.stop();
    }

    console.log('Switching camera position...');

    this.followTarget = null;

    this.controls.object.position.copy(position);
    this.controls.target = look;

    console.log('Done!');
  }

  changeParent(parent) {
    // this.controls.object.parent.remove(this.controls.object);
    const camGlobal = new THREE.Vector3().setFromMatrixPosition(this.controls.object.matrixWorld);// we need the global position
    this.controls.object.parent = parent;
    this.controls.object.position.copy(camGlobal);
  }

  lookAt(look) {
    this.controls.target = look;
  }

  followZ(target, look, offset) {
    this.zFollow = true;
    if (this.followTarget) {
      this.followTarget = null;
    }
    this.followTarget = target;
    this.offsetObj = offset;
    this.lookObj = look;
  }

  clearFollow() {
    this.followTarget = null;
  }

  follow(target, look, offset, zFollow = false) {
    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(target.matrixWorld);
    vector.add(offset);
    this.controls.object.position.z = vector.z;

    this.zFollow = zFollow;
    if (this.followTarget) {
      this.followTarget = null;
    }
    this.followTarget = target;
    this.offsetObj = offset;
    this.lookObj = look;
  }

  followZoom(newOffset, easing, duration) {
    return new TWEEN.Tween(this.offsetObj)
      .to(newOffset, duration)
      .easing(easing)
      .start();
  }

  update(timeDelta) {
    if (this.followTarget) {
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(this.followTarget.matrixWorld);
      vector.add(this.offsetObj);
      this.controls.object.position.x = vector.x * this.trackSpeed.t + this.controls.object.position.x * (1-this.trackSpeed.t);
      this.controls.object.position.y = vector.y * this.trackSpeed.t + this.controls.object.position.y * (1-this.trackSpeed.t);
      if (this.zFollow) {
        this.controls.object.position.z = vector.z * this.trackSpeed.t + this.controls.object.position.z * (1-this.trackSpeed.t);
      }
      vector.z = 0;
      this.controls.target = vector.clone()
        .multiplyScalar(this.trackSpeed.t)
        .add(this.controls.target.clone().multiplyScalar(1-this.trackSpeed.t));
    }
  }
}

export default CameraControl;
