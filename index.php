<?php

require "libs/packager/packager.php";
require "libs/control/control.php";
require "libs/markdown.php";

$packages = YAML::decode_file('packages.yml');
if (empty($packages)) $packages = array();

Control::config('default_controller', 'web');

new Control();

?>
