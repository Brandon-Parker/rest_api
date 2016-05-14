describe('a simple test to pass', () => {
  it('should test something', () => {
    browser.get('http://localhost:5000');
    element(by.model('jediCtrl.newJedi.name')).sendKeys('testman');
    element(by.model('jediCtrl.newJedi.ranking')).sendKeys('bad ass');
    element(by.model('jediCtrl.newJedi.weaponPreference')).sendKeys('stick thing');
    element(by.model('jediCtrl.newJedi.lightsaberColor')).sendKeys('WHO CARES');
    element(by.model('jediCtrl.newJedi.catchphrase')).sendKeys('WOOOOO');
    element(by.model('jediCtrl.newJedi.handCount')).sendKeys('2');
    element(by.css('.btn-create-jedi')).click();
    element.all(by.css('#jediList li:last-child')).getText((text) => {
      expect(text.toEqual('testman is a badass who uses a stickthing. Their lightsaber is' +
       'WHO CARES and their catchphrase is WOOOOO with 2 hands.'));
    });
  });
});
