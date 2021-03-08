module.exports = {
    '1. Test that exactly one root SVG was created.': (browser) => {
        browser.url('http://localhost:9000').pause(1000);
        browser.expect.element('body').to.be.present.before(1000);
        browser.expect.element('.sliderSVG').to.be.a('svg');
        browser.expect.element('.sliderSVG:nth-of-type(2)').to.not.be.present;
    },

    '2. Test that legend is displayed for all 1 slider': (browser) => {
        browser.expect.element('.legend').to.be.present;

        browser.expect.element('.legend__title').text.to.contain('Transportation');
        browser.expect.element(".legend__color--transportation").to.be.present;
    },

    '3. Test that slider is correctly initialized': (browser) => {
        browser.pause(1000);
        browser.expect.element('.sliderSVG__handle').to.have.attribute('style').which.contains('rotate(100');
    },

    '4. Test that slider value is correctly initialized': (browser) => {
        browser.expect.element("#legend__transportation .legend__price").text.to.contain('$300');
    },

    '5. Test slider changed value and changed position': (browser) => {
        browser.expect.element('.sliderSVG__handle').to.have.attribute('style').which.contains('rotate(100');
        browser.moveToElement('circle', 220, 200).mouseButtonClick(0);
        
        browser.expect.element('.sliderSVG__handle').to.have.attribute('style').which.contains('rotate(120');
        browser.expect.element("#legend__transportation .legend__price").text.to.contain('$700');
        browser.end();
    },

};
