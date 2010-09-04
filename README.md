Packager Web
============

Packager Web is a web application that uses [Packager](http://github.com/kamicane/packager) to download scripts, frameworks, plugins and the likes that follow the MooTools-like `package.yml` manifest and yaml headers syntax.

Installation
------------
	
	git clone git://github.com/kamicane/packager-web.git
	git submodule init
	git submodule update

Configuration
-------------

Create a `packages.yml` and insert at least one `package.yml` path. If you have the source for mootools core 1.3 for instance, point it to its `package.yml`. You can use the `packages.yml.example` as base for your `packages.yml` Your `packages.yml` will look like this:

	- "/Users/kamicane/Sites/mootools-core/package.yml"
	- "/Users/kamicane/Sites/mootools-more/package.yml"
	- "/Users/kamicane/Sites/some-plugin/package.yml"
	
Keep in mind this has to be *valid* yaml. Use two spaces before the dash in lists, not a tab. If you get a PHP exception, it means some of the specified paths don't exist, or are not parsable by [Packager](http://github.com/kamicane/packager).

Web Interface
-------------

Point your web browser to http://localhost/packager-web/. Select the desired components and click download. A file will be downloaded. Enjoy.
