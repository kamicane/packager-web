(function(){

var packages = {},
	components = {};

var Packager = this.Packager = {

	init: function(form){
		form = document.id(form || 'packager');

		form.getElements('.package').each(function(element){
			var name = element.get('id').substr(8);

			var pkg = packages[name] = {
				enabled: true,
				element: element,
				toggle: element.getElement('.toggle'),
				components: []
			};

			element.getElements('input[type=checkbox]').each(function(element){
				element.set('checked', false);
				element.setStyle('display', 'none');

				var depends = element.get('data-depends'),
					name = element.get('value'),
					parent = element.getParent('tr');

				depends = depends ? depends.split(',') : [];

				pkg.components.push(name);
				var component = components[name] = {
					element: element,
					depends: depends,
					parent: parent,
					selected: false,
					required: []
				};

				parent.addListener('click', function(){
					if (component.selected) Packager.deselect(name);
					else Packager.select(name);
				});
			});

			element.getElement('.select').addListener('click', function(){
				Packager.selectPackage(name);
			});

			element.getElement('.deselect').addListener('click', function(){
				Packager.deselectPackage(name);
			});

			element.getElement('.disable').addListener('click', function(){
				Packager.disablePackage(name);
			});

			element.getElement('.enable').addListener('click', function(){
				Packager.enablePackage(name);
			});

		});

		form.addEvents({
			submit: function(event){
				if (!Packager.getSelected().length) event.stop();
			},
			reset: function(event){
				event.stop();
				Packager.reset();
			}
		});

		Packager.fromHash();
	},

	check: function(name){
		var component = components[name],
			element = component.element;

		if (element.get('checked') || !component.selected && !component.required.length) return;

		element.set('checked', true);
		component.parent.addClass('checked').removeClass('unchecked');

		component.depends.each(function(dependancy){
			Packager.require(dependancy, name);
		});
	},

	uncheck: function(name){
		var component = components[name],
			element = component.element;

		if (!element.get('checked') || component.selected || component.required.length) return;

		element.set('checked', false);
		component.parent.addClass('unchecked').removeClass('checked');

		component.depends.each(function(dependancy){
			Packager.unrequire(dependancy, name);
		});
	},

	select: function(name){
		var component = components[name];

		if (component.selected) return;

		component.selected = true;
		component.parent.addClass('selected');

		this.check(name);
	},

	deselect: function(name){
		var component = components[name];

		if (!component.selected) return;

		component.selected = false;
		component.parent.removeClass('selected');

		this.uncheck(name);
	},

	require: function(name, req){
		var component = components[name];
		if (!component) return;

		var required = component.required;
		if (required.contains(req)) return;

		required.push(req);
		component.parent.addClass('required');

		this.check(name);
	},

	unrequire: function(name, req){
		var component = components[name];
		if (!component) return;

		var required = component.required;
		if (!required.contains(req)) return;

		required.erase(req);
		if (!required.length) component.parent.removeClass('required');

		this.uncheck(name);
	},

	selectPackage: function(name){
		var pkg = packages[name];
		if (!pkg) return;

		pkg.components.each(function(name){
			Packager.select(name);
		});
	},

	deselectPackage: function(name){
		var pkg = packages[name];
		if (!pkg) return;

		pkg.components.each(function(name){
			Packager.deselect(name);
		});
	},

	enablePackage: function(name){
		var pkg = packages[name];
		if (!pkg || pkg.enabled) return;

		pkg.enabled = true;
		pkg.element.removeClass('package-disabled');
		pkg.element.getElement('tr').removeClass('last');
		pkg.toggle.set('value', '');

		pkg.components.each(function(name){
			components[name].element.set('disabled', false);
		});
	},

	disablePackage: function(name){
		var pkg = packages[name];
		if (!pkg || !pkg.enabled) return;

		pkg.enabled = false;
		pkg.element.addClass('package-disabled');
		pkg.element.getElement('tr').addClass('last');
		pkg.toggle.set('value', name);

		pkg.components.each(function(name){
			components[name].element.set('disabled', true);
		});
	},

	getSelected: function(){
		var selected = [];
		for (var name in components) if (components[name].selected) selected.push(name);
		return selected;
	},

	setSelected: function(selected){
		for (var name in components){
			if (selected.contains(name)) this.select(name);
			else this.deselect(name);
		}
	},

	fromHash: function(){
		var hash = window.location.hash;
		if (!hash) return;
		var components = hash.substr(1).split(';');
		this.setSelected(components);
	},

	save: function(){
		return JSON.encode(this.getSelected());
	},

	load: function(selected){
		this.setSelected(JSON.decode(selected));
	},

	reset: function(){
		for (var name in components) this.deselect(name);
	}

};

document.addEvent('domready', Packager.init);

})();
