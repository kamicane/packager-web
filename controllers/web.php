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
				'package_web' => markdown($pkg->get_package_web($package)),
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
		$addheaders = $this->post('addheaders');
		$disabled = $this->post('disabled');

		$pkg = new Packager($packages);

		foreach ($disabled as $package){
			if ($package) $pkg->remove_package($package);
		}

		$contents = $pkg->build_from_files($files);

		header("Content-Type: text/plain");
		header('Content-Disposition: attachment; filename="' . $pkg->get_package_name() . '.js"');

		if ($addheaders) echo $this->get_headers($pkg, $files);
		echo $contents;
	}

	public function get_headers($pkg, $files){
		$header = Array();
		$header['copyrights'] = Array();
		$header['licenses'] = Array();
		$header['components'] = Array();

		if (is_array($files)) foreach ($files as $file) {
			$file_name = $pkg->get_file_name($file);
			$file_package = $pkg->get_file_package($file);
			$c = utf8_encode("\xa9");
			$header['copyrights'][] = '- ' . preg_replace("/^(?:(?:copyright|&copy;|$c)\s*)+/i", '', $pkg->get_package_copyright($file_package));
			$header['licenses'][] = "- {$pkg->get_package_license($file_package)}";
			$header['components'][] = "- $file_package/$file_name: [" . implode(", ", $pkg->get_file_provides($file)) . "]";
		}
		$head = "/*\n---\n";
		foreach ($header as $k => &$h) {
			$heads = Array();
			foreach ($h as $v) {
				if (!in_array($v, $heads)) {
					$heads[] = "{$v}";
				}
			}
			$h = "{$k}:\n  " . implode("\n  ", $heads) . "\n";
		}
		$head .= implode("\n", $header);
		$head .="...\n*/\n";

		return $head;
	}

}

?>
