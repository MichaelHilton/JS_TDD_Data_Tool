<?php
$thefile = $_POST["filename"]; /* Our filename as defined earlier */
$towrite = $_POST["TDDCycles"]; /* What we'll write to the file */
echo $towrite;

$openedfile = fopen('Cycles_'.$thefile, "w");
$encoded = json_encode($towrite);
fwrite($openedfile, $encoded);
fclose($openedfile);
return "<br> <br>".$towrite;

?>