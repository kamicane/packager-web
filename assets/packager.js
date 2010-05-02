var Packager = {

	start: function(){
		$$('input[type=checkbox]').each(function(checkBox){
			checkBox.checked = false;
			
			var depends = checkBox.get('depends');
			var value = checkBox.get('value');
			
			depends = depends ? depends.split(',') : [];
			
			CheckBoxes[value] = {
				checkBox: checkBox,
				depends: depends,
				parent: checkBox.getParent('tr')
			};
			
			checkBox.style.display = 'none';
			
			CheckBoxes[value].parent.addListener('click', function(){
				Packager.buffer = {};
				if (checkBox.checked == false) Packager.check(value);
				else Packager.uncheck(value);
			});
		});
	},
	
	check: function(name, index){
		if (Packager.buffer[name]) return;
		Packager.buffer[name] = true;

		var checkBox = CheckBoxes[name];
		if (checkBox.checkBox.checked == true) return;
		
		checkBox.checkBox.checked = true;
		checkBox.parent.addClass('checked').removeClass('unchecked');

		if ($type(index) == 'number') return;
		checkBox.depends.each(Packager.check);
	},
	
	uncheck: function(name, index){
		if (Packager.buffer[name]) return;
		Packager.buffer[name] = true;

		var checkBox = CheckBoxes[name];
		if (checkBox.checkBox.checked == false) return;
		
		checkBox.checkBox.checked = false;
		checkBox.parent.addClass('unchecked').removeClass('checked');
		
		for (var n in CheckBoxes){
			if (CheckBoxes[n].depends.contains(name)) Packager.uncheck(n);
		}
	}

};

var CheckBoxes = {};

document.addEvent('domready', Packager.start);
