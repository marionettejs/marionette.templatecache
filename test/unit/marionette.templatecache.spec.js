import TemplateCache from '../../src/marionette.templatecache';

describe('template cache', function() {
  'use strict';

  beforeEach(function() {
    TemplateCache.clear();
    var templateString = '<script id="foo" type="template">foo</script><script id="bar" type="template">bar</script><script id="baz" type="template">baz</script>';
    this.setFixtures(templateString);
    this.loadTemplateSpy = this.sinon.spy(TemplateCache.prototype, 'loadTemplate');
  });

  describe('renderer', function() {
    beforeEach(function() {
      Marionette.View.setRenderer(TemplateCache.render);
    });

    describe('when a template function', function() {
      it('should render the template into the view', function() {
        Marionette.View.setRenderer(TemplateCache.render);

        const myView = new Marionette.View({ template: _.constant('foo') });
        myView.render();

        expect(myView.$el).to.have.$text('foo');
      });
    });

    describe('when a selector is found', function() {
      it('should render the template into the view', function() {
        Marionette.View.setRenderer(TemplateCache.render);

        const myView = new Marionette.View({ template: '#foo' });
        myView.render();

        expect(myView.$el).to.have.$text('foo');
      });
    });

    describe('when a template is not defined', function() {
      it('should throw an error', function() {

        const myView = new Marionette.View();

        expect(myView.render.bind(myView)).to.throw('Cannot render the template since its false, null or undefined.');
      });
    });

    describe('when a selector is not found', function() {
      it('should throw an error', function() {
        Marionette.View.setRenderer(TemplateCache.render);

        const myView = new Marionette.View({ template: '#not-a-template' });

        expect(myView.render.bind(myView)).to.throw('Could not find template: "#not-a-template"');
      });
    });
  });

  describe('when loading a template that does not exist', function() {
    it('should throw', function() {
      expect(function() {
        TemplateCache.get('#void');
      })
        .to.throw('Could not find template: "#void"');
    });
  });
  describe('when loading a template for the first time', function() {
    beforeEach(function() {
      TemplateCache.get('#foo');
    });

    it('should load from the DOM', function() {
      expect(this.loadTemplateSpy).to.have.been.called;
    });
  });

  describe('template options', function() {
    beforeEach(function() {
      this.templateOptions = {sample: 'options'};
      this.compileTemplateSpy = sinon.spy(TemplateCache.prototype, 'compileTemplate');

      TemplateCache.get('#foo', this.templateOptions);
    });

    it('passes options when getting a template', function() {
      expect(this.compileTemplateSpy).to.have.been.calledWith('foo', this.templateOptions);
    });
  });

  describe('when loading a template more than once', function() {
    beforeEach(function() {
      TemplateCache.get('#foo');
      TemplateCache.get('#foo');
    });

    it('should load from the DOM once', function() {
      expect(this.loadTemplateSpy).to.have.been.calledOnce;
    });
  });

  describe('when clearing the full template cache', function() {
    beforeEach(function() {
      TemplateCache.get('#foo');
      TemplateCache.clear();
    });

    it('should clear the cache', function() {
      expect(_.size(TemplateCache.templateCaches)).to.equal(0);
    });
  });

  describe('when clearing a single template from the cache', function() {
    beforeEach(function() {
      TemplateCache.get('#foo');
      TemplateCache.get('#bar');
      TemplateCache.get('#baz');
      TemplateCache.clear('#foo');
    });

    it('should clear the specified templates cache', function() {
      expect(TemplateCache.templateCaches).not.to.have.property('#foo');
    });

    it('should not clear other templates from the cache', function() {
      expect(TemplateCache.templateCaches).to.have.property('#bar');
      expect(TemplateCache.templateCaches).to.have.property('#baz');
    });
  });

  describe('when clearing multiple templates from the cache', function() {
    beforeEach(function() {
      TemplateCache.get('#foo');
      TemplateCache.get('#bar');
      TemplateCache.get('#baz');
      TemplateCache.clear('#foo', '#bar');
    });

    it('should clear the specified templates cache', function() {
      expect(TemplateCache.templateCaches).not.to.have.property('#foo');
      expect(TemplateCache.templateCaches).not.to.have.property('#bar');
    });

    it('should not clear other templates from the cache', function() {
      expect(TemplateCache.templateCaches).to.have.property('#baz');
    });
  });
});
