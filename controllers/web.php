<?php

class Web extends Control {
	
	protected function index(){
		global $packages;
		
		$pkg = new Packager($packages);
		
		$data = array();
		
		foreach($pkg->get_packages() as $package){
		
			$data[$package] = array(
				'files' => array(),
				'package' => $package,
				'package_web' => markdown($pkg->get_package_web()),
				'package_authors' => markdown(implode(' & ', $pkg->get_package_authors($package))),
				'package_description' => markdown($pkg->get_package_description($package)),
				'package_license' => markdown($pkg->get_package_license($package)),
				'package_copyright' => markdown($pkg->get_package_copyright($package)),
			);
			

			foreach ($pkg->get_all_files($package) as $file){
			
			
				$file_meta = array(
					'name' => $pkg->get_file_name($file),
					'depends' => implode(',', $pkg->get_file_dependancies($file)),
					'provides' => implode(',', $pkg->get_file_provides($file)),
					'description' => markdown($pkg->get_file_description($file))
				);
			
				$data[$package]['files'][$file] = $file_meta;
			
			}

		}
		
		$this->data('packages', $data);
		$this->render('interface');
	}
	
	public function download(){
		global $packages;
		
		$files = $this->post('files');
		
		$pkg = new Packager($packages);
		$contents = $pkg->build_from_files($files);
		
		header("Content-Type: text/plain");
		header('Content-Disposition: attachment; filename="' . $pkg->get_package_name() . '.js"');
		
		echo $contents;
	}
	
}

?>
