describe("jquery.fn.flipFields", function() {
  var fixture, inputs;

  beforeEach(function() {
    var html = '<input id="input1" value="foo"/>' +
               '<input id="input2" value="bar"/>';
    $("#jasmine_content").append($(html));
    fixture = $("#jasmine_content");
    inputs = $(fixture).find('input');
  });

  afterEach(function() {
    fixture.empty();
  });

  var getTextValues = function(elements) {
    return $.map(elements, function(el) { return $(el).text();});
  };

  var getValues = function(elements) {
    return $.map(elements, function(el) { return $(el).val();});
  };

  describe("after initilization", function() {
    it("should hide inputs", function() {
      expect($('input:visible').length).toEqual(2);
      expect($('input:hidden').length).toEqual(0);

      inputs.flipFields();

      expect($('input:visible').length).toEqual(0);
      expect($('input:hidden').length).toEqual(2);
    });

    it("should only convert text inputs", function() {
      fixture.append($('<input type="submit" value="Submit" />'));
      inputs = $(fixture).find('input');
      expect(inputs.length).toEqual(3);
      expect($('input:visible').length).toEqual(3);
      expect($('input:hidden').length).toEqual(0);
      expect(fixture.find("span").length).toEqual(0);
      
      inputs.flipFields();

      expect($('input:visible').length).toEqual(1);
      expect($('input:hidden').length).toEqual(2);
      expect(fixture.find("span").length).toEqual(2);      
    });

    it("should show input values in a span", function() {
      expect(fixture.find("span").length).toEqual(0);
      inputs.flipFields();
      expect(fixture.find("span").length).toEqual(2);
      expect(getTextValues(fixture.find("span"))).toEqual(getValues(inputs));
    });

    it("should not create new spans for existing flipFields", function() {
      expect(fixture.find("span").length).toEqual(0);
      inputs.flipFields();
      expect(fixture.find("span").length).toEqual(2);
      inputs.flipFields();
      expect(fixture.find("span").length).toEqual(2);
    });

    it("adds optional class on flipField spans", function() {
      expect(fixture.find("span.flipped").length).toEqual(0);
      inputs.flipFields({spanClass: "flipped"});
      expect(fixture.find("span.flipped").length).toEqual(2);
    });
  });

  describe("click", function() {
    it("should hide the value and show the input field", function() {
      inputs.flipFields();
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo", "bar"]);
      expect(getTextValues(fixture.find('span:hidden'))).toEqual([]);
      expect(getValues(fixture.find('input:visible'))).toEqual([]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["foo", "bar"]);

      fixture.find('span').eq(0).simulate("click");
      
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["bar"]);
      expect(getTextValues(fixture.find('span:hidden'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:visible'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

    });
    it("should flip previously clicked fields", function() {
      inputs.flipFields();
      fixture.find('span').eq(0).simulate("click");

      expect(getTextValues(fixture.find('span:visible'))).toEqual(["bar"]);
      expect(getTextValues(fixture.find('span:hidden'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:visible'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

      fixture.find('span').eq(1).simulate("click");

      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo"]);
      expect(getTextValues(fixture.find('span:hidden'))).toEqual(["bar"]);
      expect(getValues(fixture.find('input:visible'))).toEqual(["bar"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["foo"]);

      fixture.find('span').eq(0).simulate("click");

      expect(getTextValues(fixture.find('span:visible'))).toEqual(["bar"]);
      expect(getTextValues(fixture.find('span:hidden'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:visible'))).toEqual(["foo"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

    });
  });

  describe("onBlur", function() {
    it("should hide the input and show the correct new text in the span field", function() {
      inputs.flipFields();
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo", "bar"]);

      fixture.find('span').eq(0).simulate("click");
      fixture.find('#input1').val("baz");

      expect(getValues(fixture.find('input:visible'))).toEqual(["baz"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

      fixture.find('#input1').eq(0).trigger("blur");

      expect(getValues(fixture.find('input:visible'))).toEqual([]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["baz", "bar"]);
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["baz", "bar"]);
    });
  });

  describe("enterKey", function() {
    it("should hide the input and show the correct new text in the span field", function() {
      inputs.flipFields();
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo", "bar"]);

      fixture.find('span').eq(0).simulate("click");
      fixture.find('#input1').val("baz");

      expect(getValues(fixture.find('input:visible'))).toEqual(["baz"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

      fixture.find('#input1').trigger({type:"keypress", which: 13});

      expect(getValues(fixture.find('input:visible'))).toEqual([]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["baz", "bar"]);
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["baz", "bar"]);
    });
  });

  describe("escKey", function() {
    it("should hide the input and cancel any value changes", function() {
      inputs.flipFields();
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo", "bar"]);

      fixture.find('span').eq(0).simulate("click");
      fixture.find('#input1').val("baz");

      expect(getValues(fixture.find('input:visible'))).toEqual(["baz"]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["bar"]);

      fixture.find('#input1').trigger({type:"keypress", keyCode: 27});
      
      expect(getValues(fixture.find('input:visible'))).toEqual([]);
      expect(getValues(fixture.find('input:hidden'))).toEqual(["foo", "bar"]);
      expect(getTextValues(fixture.find('span:visible'))).toEqual(["foo", "bar"]);
    });
  });
});