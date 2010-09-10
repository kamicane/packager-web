<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Packager Web</title>

	<script src="<?php echo BASE_PATH; ?>/libs/mootools.js" type="text/javascript"></script>
	<script src="<?php echo BASE_PATH; ?>/assets/packager.js" type="text/javascript"></script>

	<link href="<?php echo BASE_PATH; ?>/libs/reset.css" rel="stylesheet" type="text/css" media="screen" />
	<link href="<?php echo BASE_PATH; ?>/assets/packager.css" rel="stylesheet" type="text/css" media="screen" />
</head>
<body>

	<form id="packager" action="<?php echo BASE_PATH; ?>/web/download" method="post">

	<?php foreach ($packages as $name => $data): ?>

		<table class="vertical">
			<tr class="first">
				<th>Name</th>
				<td><?php echo $name; ?></td>
			</tr>
			<tr class="middle">
				<th>Web</th>
				<td><?php echo $data['package_web']; ?></td>
			</tr>
			<tr class="middle">
				<th>Description</th>
				<td><?php echo $data['package_description']; ?></td>
			</tr>
			<tr class="middle">
				<th>Copyright</th>
				<td><?php echo $data['package_copyright']; ?></td>
			</tr>
			<tr class="middle">
				<th>License</th>
				<td><?php echo $data['package_license']; ?></td>
			</tr>
			<tr class="last">
				<th>Authors</th>
				<td><?php echo $data['package_authors']; ?></td>
			</tr>
		</table>

		<table class="horizontal">
			<tr class="first">
				<th class="first"></th>
				<th class="middle">File</th>
				<th class="middle">Provides</th>
				<th class="last">Description</th>
			</tr>

		<?php

		$files = $data['files'];

		$i = 0;
		$c = count($files);

		foreach ($files as $name => $file):
			$i++;

		?>

			<tr class="<?php echo ($i == $c) ? 'last ' : 'middle '?>unchecked">
				<td class="first check">
					<div class="checkbox"></div>
					<input type="checkbox" name="files[]" value="<?php echo $name; ?>" data-depends="<?php echo $file['depends']; ?>" />
				</td>
				<td class="middle file"><?php echo $file['name']; ?></td>
				<td class="middle provides"><?php echo $file['provides']; ?></td>
				<td class="last description"><?php echo $file['description']; ?></td>
			</tr>

		<?php endforeach; ?>

		</table>

	<?php endforeach; ?>

		<p class="submit">
			<input type="hidden" name="addheaders" value="0" />
			<input type="reset" id="reset" value="reset" />
			<input type="submit" value="download" />
			<input type="submit" name="addheaders" value="download with package info" />
		</p>

	</form>

</body>
</html>
