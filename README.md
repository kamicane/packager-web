Packager Web
============

Packager Web is a web application that uses packager to download scripts, frameworks, plugins and the likes that follow the MooTools-like package.yml manifest and yaml headers.

Installation
------------
	
	git clone git://github.com/kamicane/packager-web.git
	git submodule init
	git submodule update

Configuration
-------------

Edit packages.yml and insert at least one package.yml path. If you have the source for mootools core 1.3 for instance, point it to its package.yml assigning an key name to it. Your packages.yml will look like this:

	mootools-core: "/Users/kamicane/Sites/mootools-core/package.yml"
	mootools-more: "/Users/kamicane/Sites/mootools-more/package.yml"
	some-plugin: "/Users/kamicane/Sites/some-plugin/package.yml"

Web Interface
-------------

Point your web browser to http://localhost/packager-web/$package. $package is one of the keys you assigned earlier. You can assign an infinite number of keys / paths. Select the desired components and click download. A file will be downloaded. Enjoy.

Web API
-------

### Syntax:

	http://localhost/packager-web/$package/$component1/$component2/$component3 etc…

### Example:

	http://localhost/packager-web/mootools-core/Fx/Request/Swiff/
