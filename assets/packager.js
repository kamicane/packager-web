var Packager = {

	start: function(){
		$$('input[type=checkbox]').each(function(checkBox){
			checkBox.checked = false;

			var depends = checkBox.get('data-depends'),
				value = checkBox.get('value');

			depends = depends ? depends.split(',') : [];

			CheckBoxes[value] = {
				element: checkBox,
				depends: depends,
				parent: checkBox.getParent('tr')
			};

			checkBox.style.display = 'none';

			CheckBoxes[value].parent.addListener('click', function(){
				Packager.buffer = {};
				if (checkBox.get('data-selected')) Packager.deselect(value);
				else Packager.select(value);
			});
		});
	},

	check: function(name){
		var checkBox = CheckBoxes[name],
			element = checkBox.element;

		if (element.get('checked') || !element.get('data-selected') && !element.get('data-required'))
			return false;

		element.set('checked', true);
		checkBox.parent.addClass('checked').removeClass('unchecked');

		return true;
	},

	uncheck: function(name){
		var checkBox = CheckBoxes[name],
			element = checkBox.element;

		if (!element.get('checked') || element.get('data-selected') || element.get('data-required'))
			return false;

		element.set('checked', false);
		checkBox.parent.addClass('unchecked').removeClass('checked');

		return true;
	},

	select: function(name, index){
		if (Packager.buffer[name]) return;
		Packager.buffer[name] = true;

		var checkBox = CheckBoxes[name],
			element = checkBox.element;

		if (element.get('data-selected')) return;

		element.set('data-selected', '1');

		checkBox.parent.addClass('selected');
		this.check(name)

		if ($type(index) == 'number') return;
		checkBox.depends.each(function(dependancy){
			Packager.require(dependancy, name);
		});
	},

	deselect: function(name, index){
		if (Packager.buffer[name]) return;
		Packager.buffer[name] = true;

		var checkBox = CheckBoxes[name],
			element = checkBox.element;

		if (!element.get('data-selected')) return;

		element.set('data-selected', null);

		checkBox.parent.removeClass('selected');
		this.uncheck(name)

		checkBox.depends.each(function(dependancy){
			Packager.unrequire(dependancy, name);
		});
	},

	require: function(name, req){
		var checkBox = CheckBoxes[name],
			element = checkBox.element,
			required = element.get('data-required');

		if (required && required.contains(req)) return;

		element.set('data-required', (required ? required + ' ' : '') + req);

		checkBox.parent.addClass('required');
		this.check(name)

		checkBox.depends.each(function(dependancy){
			Packager.require(dependancy, name);
		});
	},

	unrequire: function(name, req){
		var checkBox = CheckBoxes[name],
			element = checkBox.element,
			required = element.get('data-required');

		if (!required || !required.contains(req)) return;

		element.set('data-required', required.replace(new RegExp('(^\\s*|\\s+)' + req + '(?:\\s+|\\s*$)'), '$1'));

		if (!element.get('data-required')) checkBox.parent.removeClass('required');
		if (!this.uncheck(name)) return;

		checkBox.depends.each(function(dependancy){
			Packager.unrequire(dependancy, name);
		});
	}

};

var CheckBoxes = {};

document.addEvent('domready', Packager.start);
