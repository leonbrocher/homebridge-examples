import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service
} from "homebridge";

/*
 * IMPORTANT NOTICE
 *
 * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the "hap-nodejs" module).
 * The above import block may seem like, that we do exactly that, but actually those imports are only used for types and interfaces
 * and will disappear once the code is compiled to Javascript.
 * In fact you can check that by running `npm run build` and opening the compiled Javascript file in the `dist` folder.
 * You will notice that the file does not contain a `... = require("homebridge");` statement anywhere in the code.
 *
 * The contents of the above import statement MUST ONLY be used for type annotation or accessing things like CONST ENUMS,
 * which is a special case as they get replaced by the actual value and do not remain as a reference in the compiled code.
 * Meaning normal enums are bad, const enums can be used.
 *
 * You MUST NOT import anything else which remains as a reference in the code, as this will result in
 * a `... = require("homebridge");` to be compiled into the final Javascript code.
 * This typically leads to unexpected behavior at runtime, as in many cases it won't be able to find the module
 * or will import another instance of homebridge causing collisions.
 *
 * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `hap` property
 * of the api object, which can be acquired for example in the initializer function. This reference can be stored
 * like this for example and used to access all exported variables and classes from HAP-NodeJS.
 */
let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory("ExampleSwitch", ExampleSwitch);
};

class ExampleSwitch implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly name: string;
  private switchOn = false;

  private readonly windowCoverService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;

    this.windowCoverService = new hap.Service.WindowCovering(this.name);
    this.windowCoverService.getCharacteristic(hap.Characteristic.CurrentPosition)
    .onGet(this.handleCurrentPositionGet.bind(this));

    this.windowCoverService.getCharacteristic(hap.Characteristic.PositionState)
      .onGet(this.handlePositionStateGet.bind(this));

    this.windowCoverService.getCharacteristic(hap.Characteristic.TargetPosition)
      .onGet(this.handleTargetPositionGet.bind(this))
      .onSet(this.handleTargetPositionSet.bind(this));

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
      .setCharacteristic(hap.Characteristic.Model, "Custom Model");

    log.info("Window Cover finished initializing!");
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log("Identify!");
  }


  handleCurrentPositionGet() {
    this.log.debug('Triggered GET CurrentPosition');
    // set this to a valid value for CurrentPosition
    const currentValue = 1;
    return currentValue;
  }

  handlePositionStateGet() {
    this.log.debug('Triggered GET PositionState');
    // set this to a valid value for PositionState
    const currentValue = hap.Characteristic.PositionState.DECREASING;
    return currentValue;
  }


  /**
   * Handle requests to get the current value of the "Target Position" characteristic
   */
  handleTargetPositionGet() {
    this.log.debug('Triggered GET TargetPosition');
    // set this to a valid value for TargetPosition
    const currentValue = 1;
    return currentValue;
  }

  /**
   * Handle requests to set the "Target Position" characteristic
   */
  async handleTargetPositionSet(value:CharacteristicValue) {
    this.log.debug('Triggered SET TargetPosition:',value);
  }
  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.windowCoverService,
    ];
  }

}
