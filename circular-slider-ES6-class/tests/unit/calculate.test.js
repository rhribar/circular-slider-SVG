/* import { Slider } from "../../lib/Slider"; */

let Slider = require("../../lib/Slider").default;

// doesnt work TypeError: Cannot read property 'appendChild' of null

test('Modify only instance', () => {
    let food = new Slider({container: "window", color: "#5d3b6d", max: 1000, min: 50, step: 50, radius: 180, amountContainerId: "transportation"});
    let spy = jest.spyOn(food, 'test').mockImplementation(() => 'Hello');

    expect(food.test()).toBe("Hello");

    // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
    spy.mockRestore();
});