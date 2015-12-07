describe('WarningChecker', function() {
  var checker = new WarningChecker();

  describe('.addWarning', function() {
    it('handles an empty string', function() {
      var content = '';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toEqual(content);
    });

    it('adds a warning around just', function() {
      var content = 'test just test';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect($fixture.find('span.warning')).toHaveText('just');
      expect(result).toMatch(/<span class="warning">just<\/span>/);
    });

    it('adds a warning around sorry', function() {
      var content = 'test just test sorry test';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'sorry', 'warning');
      expect(result).toMatch(/<span class="warning">sorry<\/span>/);
    });

    it('handles multiple instances of a keyword', function() {
      var content = 'sorry sorry test';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'sorry', 'warning');
      expect(result).toEqual('<span class="warning">sorry<\/span> <span class="warning">sorry<\/span> test');
    });

    it('does not wrap a keyword that has already been wrapped', function() {
      var content = '<span class="blah-warning">sorry<\/span> <span class="blah-warning">sorry<\/span>';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'sorry', 'blah-warning');
      expect(result).toEqual(content);
    });

    it('wraps a keyword that is within an un-related span', function() {
      var content = 'Why so <span class="blue">sorry<\/span>?';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'sorry', 'blah-warning');
      expect(result).toEqual('Why so <span class="blue"><span class="blah-warning">sorry<\/span><\/span>?');
    });

    it('matches case insensitive', function() {
      var content = 'jUsT kidding';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toMatch(/<span class="warning">jUsT<\/span>/);
    });

    it('catches keywords with punctuation', function() {
      var content = 'just. test';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toEqual('<span class="warning">just<\/span>. test');
    });

    it('matches phrases', function() {
      var content = 'my cat is so sorry because of you';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'so sorry', 'big-warning');
      expect(result).toEqual('my cat is <span class="big-warning">so sorry<\/span> because of you');
    });

    it('only matches the whole word', function() {
      var content = 'my justification';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toEqual(content);
    });

    it('does NOT consider non-breaking spaces to be word breaks so Gmail can do its special handling', function() {
      var content = 'I just&nbsp;want to go';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toEqual('I just&nbsp;want to go');
    });

    it('does NOT perform replacement when target word is before a <br>', function() {
      var content = 'I just<br>';
      var $fixture = setFixtures(content);
      var result = checker.addWarning($fixture, 'just', 'warning');
      expect(result).toEqual('I just<br>');
    });

    it('does not allow the warningClass to contain the keyword', function() {
      expect(function() {
        var $fixture = setFixtures('just sorry');
        checker.addWarning($fixture, 'just', 'just-warning');
      }).toThrowError(/warningClass cannot contain the keyword/);
    });
  });
});
