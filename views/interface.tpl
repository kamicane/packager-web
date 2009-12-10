<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html lang="en">
<head>
	
	<title>Packager</title>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	
	<script src="<?php echo BASE_PATH;?>/libs/mootools.js" type="text/javascript"></script>
	<script src="<?php echo BASE_PATH;?>/assets/packager.js" type="text/javascript"></script>
	
	<link href="<?php echo BASE_PATH;?>/libs/reset.css" rel="stylesheet" type="text/css" media="screen" />
	<link href="<?php echo BASE_PATH;?>/assets/packager.css" rel="stylesheet" type="text/css" media="screen" />

</head>
<body>
	
	<?php

	if (!empty($instructions)){
		echo "<div class=\"instructions\">$instructions</div>";
	} else {
	
	?>
	
	<table class="vertical">
		<tr class="first">
			<th>Name</th>
			<td><?php echo $package_name;?></td>
		</tr>
		<tr class="middle">
			<th>Web</th>
			<td><?php echo $package_web;?></td>
		</tr>
		<tr class="middle">
			<th>Description</th>
			<td><?php echo $package_description;?></td>
		</tr>
		<tr class="middle">
			<th>Copyright</th>
			<td><?php echo $package_copyright;?></td>
		</tr>
		<tr class="last">
			<th>Authors</th>
			<td><?php echo $package_authors;?></td>
		</tr>
	</table>
	
	<form action="<?php echo BASE_PATH;?>/web/download_files" method="post">

	<input type="hidden" name="package" value="<?php echo $package;?>"/>
	
	<table class="horizontal">
		<tr class="first">
			<th class="first"></th>
			<th class="middle">File</th>
			<th class="middle">Provides</th>
			<th class="last">Description</th>
		</tr>
		<?php
		
		$c = 0;
		$i = 0;
		
		foreach ($files as $name => $file) $c++;
		
		foreach ($files as $name => $file){
			$i++;
			$class_name = ($i == $c) ? 'last' : 'middle';
			echo "<tr class=\"$class_name unchecked\">";
			echo "<td class=\"first check\"><div class=\"checkbox\"></div>";
			$depends = $file['depends'];
			$provides = $file['provides'];
			echo "<input type=\"checkbox\" name=\"files[]\" value=\"$name\" depends=\"$depends\" provides=\"$provides\"/></td>";
			echo "<td class=\"middle file\">$name</td>";
			echo "<td class=\"middle provides\">$provides</td>";
			$description = $file['description'];
			echo "<td class=\"last description\">$description</td>";
			echo "</tr>";
		}
		
		?>
	</table>
	<p class="submit">
		<input type="submit" value="download" />
	</p>
	
	</form>
	
	<?php
	}
	?>
	
</body>
</html>
