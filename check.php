<?php
@session_start();
$start = microtime(true);
$arrX = array(-2,-1.5,-1,-0.5,0,0.5,1,1.5,2);
$arrR = array(1,2,3,4,5);
$X = $_POST["buttonX"];
$Y = $_POST["textY"];
$R = $_POST["buttonR"];
date_default_timezone_set("UTC"); //установка временной зоны по умолчанию
$timezoneOffset = $_POST["timezoneOffset"];// сдвиг в секундах
$SESSION = $_POST["SESSION"];
$time = time() - $timezoneOffset * 60;
$currentTime = date("H:i:s",$time);

$checkY = true;
$checkX = true;
$checkR = true;


function strCompare($first, $second) {
    $first = (string) $first;
    $second = (string) $second;
    while (strlen($first) > strlen($second)) {
        if (strpos($second, '.') === false)
            $second = $second.'.';
        $second = $second.'0'; 
    }
    if  (strpos($first, '-') > -1 && strpos($second, '-')>-1)

        if (strcasecmp($first, $second) == 0)
            return 0;
        else
            if (strcasecmp($first, $second) == 1)
                return -1;
            else return 1;

    else
        return strcasecmp($first, $second);
    }


function checkY($Y)
{
    if ( strCompare(textY,-5)>0 && strCompare($Y,5) < 0 && !is_null($Y) && is_numeric($Y) ) {
        return true;
    } else
        return false;
}

function checkButtonValue($value, $arrX)
{
    if (is_numeric($value) && !is_null($value)) {

        for ($i = 0; $i < count($arrX); $i++) {
            if ($arrX[$i] == $value) {
                return true;
            }
        };
        return false;
    } else
        return false;
}

$checkY = checkY($Y);
$checkX = checkButtonValue($X,$arrX);
$checkR = checkButtonValue($R,$arrR);

if ($checkY && $checkX && $checkR) {

    $line = sqrt(pow($X, 2) + pow($Y, 2));

    $triangle = ($X >= (-$R / 2) && $X <= 0) && ($Y >= 0 && strCompare($Y, 2 * $X + $R) <= 0);
    $square = ($X >= 0 && $X <= $R) && (strCompare($Y, -$R / 2) >= 0 && $Y <= 0);
    $circle = ($X >= 0 && $Y >= 0 && strCompare( $line , ($R / 2))<=0);

//    $triangle = ( $X >= (-$R / 2) && $X <= 0) && ($Y >= 0 && $Y <= 2 * $X + $R);
//    $square = ($X >= 0 && $X <= $R) && ($Y >=-$R / 2 && $Y <= 0);
//    $circle = ($X >= 0 && $Y >= 0 && $line <= ($R / 2));

    if ($triangle || $square || $circle) {

        $hit = "Точка попадает в заданную область";
        $color = "green";

    } else {

        $hit = "Точка не попадает в заданную область";
        $color = "red";

    }
    $time = microtime(true) - $start;

    $data = '{
  "X" : ' . $X . ' ,
  "Y" : "' . $Y . '" ,
  "R" : ' . $R . ' ,
  "hit" : "' . $hit . '" ,
  "currentTime" :"' . $currentTime . ' ",
  "time" : ' . $time . ' ,
  "color" :" ' . $color .
        '" }';
    array_push ($_SESSION['arr'], $data);
    echo $data;

} else {

    $error = ' {
    "checkX" : "' . $checkX . '" ,
    "checkY" : "' . $checkY . '" ,
    "checkR" : "' . $checkR .
        '" }';
    echo $error;
}


