/**
 * Mountain car system simulator.
 *
 * There are two state variables in this system:
 *
 *   - position: The x-coordinate of location of the car.
 *   - velocity: The velocity of the car.
 *
 * The system is controlled through three distinct actions:
 *
 *   - leftward acceleration.
 *   - rightward acceleration
 *   - no acceleration
 */
export class MountainCar {
  /**
   * Constructor of MountainCar.
   */
  constructor() {
    // Constants that characterize the system.

    this.minPosition = -1.2;
    this.maxPosition = 0.6;
    this.maxSpeed = 0.07;
    this.minSpeed = -0.07;
    this.goalPosition = 0.5;
    this.goalVelocity = 0;
    this.gravity = 0.0025;
    this.carWidth = 0.2;
    this.carHeight = 0.1;
    this.force = 0.0013;


    this.setRandomState();
  }

  /**
   * Set the state of the mountain car system randomly.
   */
  setRandomState() {
    // The state variables of the mountain car system.
    // Car position
    this.position = Math.random() / 5 - 0.6;
    // Car velocity.
    this.velocity = 0;
  }

  /**
   * Get current state as a tf.Tensor of shape [1, 2].
   */
  getStateTensor() {
    return [this.position, this.velocity];
  }

  /**
   * Update the mountain car system using an action.
   * @param {number} action Only the sign of `action` matters.
   *   Action is an integer, in [-1, 0, 1]
   *   A value of 1 leads to a rightward force of a fixed magnitude.
   *   A value of -1 leads to a leftward force of the same fixed magnitude.
   *   A value of 0 leads to no force applied.
   * @returns {bool} Whether the simulation is done.
   */
  update(action) {
    this.velocity += action * this.force - Math.cos(3 * this.position) * this.gravity;
    this.velocity = Math.min(Math.max(this.velocity, this.minSpeed), this.maxSpeed);

    this.position += this.velocity
    this.position = Math.min(Math.max(this.position, this.minPosition), this.maxPosition);

    if (this.position === this.minPosition && this.velocity < 0 ) this.velocity = 0;

    return this.isDone();
  }

  /**
   * Determine whether this simulation is done.
   *
   * A simulation is done when `position` reaches `goalPosition`
   * and `velocity` is greater than zero.
   *
   * @returns {bool} Whether the simulation is done.
   */
  isDone() {
    return (
      this.position >= this.goalPosition
    ) && (
      this.velocity >= this.goalVelocity
    );
  }

  render(canvas){
    if (!canvas.style.display) {
      canvas.style.display = 'block';
    }
    const X_MIN = this.minPosition;
    const X_MAX = this.maxPosition;
    const xRange = X_MAX - X_MIN;
    const scale = canvas.width / xRange;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const halfW = canvas.width / 2;

    // Draw the cart.
    const cartW = this.carWidth * scale;
    const cartH = this.carHeight * scale;
    const cartX = (this.position - this.minPosition) * scale;
    const cartY = canvas.height - (Math.sin(3 * this.position) * 0.45 + 0.55) * scale;

    //Set the origin to the center of the cart
    context.setTransform(1, 0, 0, 1, cartX, cartY);

    //Rotate the canvas around the origin
    context.rotate(- Math.cos(3 * this.position));

    //Draw the cart
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.strokeRect(- cartW / 2, -1.5 * cartH, cartW, cartH);

    // Draw the wheels under the cart.
    const wheelRadius = cartH / 4;
    for (const offsetX of [-1, 1]) {
      context.beginPath();
      context.lineWidth = 2;
      context.arc(
        - cartW / 4 * offsetX, wheelRadius - cartH / 2,
        wheelRadius, 0, 2 * Math.PI);
      context.stroke();
    }

    // Restore canvas state as saved from above
    context.setTransform(1,0,0,1,0,0);

    // Draw the ground.
    context.beginPath();
    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    const step = (this.maxPosition - this.minPosition) / 100;
    for (let x = this.minPosition; x < this.maxPosition; x += step) {
      const y = canvas.height - (Math.sin(3 * x) * 0.45 + 0.55) * scale;
      context.lineTo((x - this.minPosition) * scale, y);
      context.moveTo((x - this.minPosition) * scale, y);
    }
    context.stroke();
  }
}
