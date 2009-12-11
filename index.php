<?php

require "libs/packager/packager.php";
require "libs/control/control.php";
require "libs/markdown.php";

$packages = YAML::decode_file('packages.yml');

foreach ($packages as $name => $path){
	Control::route("|^$name|", "web", "start"); //dynamic routes ftw
}

Control::config('default_controller', 'web');

new Control();

?>
