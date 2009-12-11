<?php

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
		else return $this->output($package, $components);
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
			'package_name' => $this->pkg->get_key('name'),
			'package_web' => markdown($this->pkg->get_key('web')),
			'package_authors' => markdown($this->pkg->get_key('authors')),
			'package_description' => markdown($this->pkg->get_key('description')),
			'package_license' => markdown($this->pkg->get_key('license')),
			'package_copyright' => markdown($this->pkg->get_key('copyright')),
			'files' => $data_files
		));
		
		$this->render('interface');
	}
	
	public function download(){
		global $packages;
		
		$files = $this->post('files');
		$package = $this->post('package');
		
		$pkg = new Packager($packages[$package]);
		$contents = $pkg->build_from_files($files);
		
		header("Content-Type: text/plain");
		header('Content-Disposition: attachment; filename="' . $pkg->get_key('exports') . '"');
		
		echo $contents;
	}
	
	protected function output($package, $components){
		global $packages;
		
		$pkg = new Packager($packages[$package]);

		$contents = $pkg->build_from_components($components);

		header('Content-Type: text/javascript');
		echo $contents;
	}
	
}

?>
