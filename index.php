<?php

require "packager/packager.php";
require "libs/control.php";
require "libs/markdown.php";

$packages = YAML::decode_file('packages.yml');

foreach ($packages as $name => $path){
	Control::route("|^$name|", "web", "start"); //dynamic routes ftw
}

Control::config('default_controller', 'web');


class Web extends Control {
	
	protected function index(){
		$this->data('instructions', markdown(file_get_contents("README.md")));
		$this->render('interface');
	}
	
	protected function start($package){
		global $packages;
		
		$components = func_get_args();
		array_shift($components);
		
		if (empty($packages[$package])) return $this->missing('package', $package);
		
		$this->pkg = new Packager($packages[$package]);
		
		if (count($components) == 0) return $this->display($package);
		else return $this->download_components($package, $components);
	}
	
	protected function display($package){
		
		$files = $this->pkg->get_all_files();

		$data_files = array();

		foreach ($files as $file) $data_files[$file] = array(
			'depends' => implode(',', $this->pkg->get_file_depends($file)),
			'provides' => implode(',', $this->pkg->get_file_provides($file)),
			'description' => markdown($this->pkg->get_file_description($file))
		);
		
		$this->data(array(
			'package' => $package,
			'package_name' => $this->pkg->get_key('package'),
			'package_web' => markdown($this->pkg->get_key('web')),
			'package_authors' => markdown($this->pkg->get_key('authors')),
			'package_description' => markdown($this->pkg->get_key('description')),
			'package_copyright' => markdown($this->pkg->get_key('copyright')),
			'files' => $data_files
		));
		
		$this->render('interface');
	}
	
	public function download_files(){
		global $packages;
		
		$files = $this->post('files');
		$package = $this->post('package');
		
		$pkg = new Packager($packages[$package]);
		$contents = $pkg->build_from_files($files);
		
		return $this->serve($pkg->get_key('exports'), $contents);
	}
	
	protected function download_components($package, $components){
		global $packages;
		
		$pkg = new Packager($packages[$package]);
		$contents = $pkg->build_from_components($components);
		
		echo $contents;
	}
	
	protected function serve($file_name, $contents){
		header("Content-Type: text/plain");
		header('Content-Disposition: attachment; filename="' . $file_name . '"');

		echo $contents;
	}
	
}

new Control();

?>