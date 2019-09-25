// кнопка X
var buttonX_container = $('.form_buttonX');
var buttonX_value = -2;

buttonX_container.each(function (index, elem) {
    elem.addEventListener("click", function (e) {
        buttonX_value = singleSelect(elem, $('.form_buttonX.selected'));
    });

});

function singleSelect(button, selected) {
    selected.each(function (index, elem) {
        elem.classList.remove('selected');

    });
    button.classList.add('selected');
    return button.value;
}

// кнопка R
var buttonR_container = $('.form_buttonR');
var buttonR_value = 1;


buttonR_container.each(function (index, elem) {
    elem.addEventListener("click", function (e) {
        ctx.clearRect(0, 0, 305, 305); //очистка для перерисовки)
        buttonR_value = singleSelect(elem, $('.form_buttonR.selected'));
        drawGraph();
    });

});

// очистка таблицы
var cleanButton = $('#cleanTable');

cleanButton.bind("click", function (e) {
    var tableRow = $("table tr");
    tableRow.remove(":not(:first)"); //удаляет в табл. все кроме шапки
    ctx.clearRect(0, 0, 305, 305); //очистка для перерисовки)
    drawGraph();
});

var textY;
var firstPattern = /^\./;
var secondPattern= /\.$/;
function checkY(textY) {
    if (!(textY == "")) {
        if (isNaN(textY) && !Number.isFinite(Number(textY)) || firstPattern.test(textY) || secondPattern.test(textY) || /^-\./.test(textY)) {
            wrongValue("Некорректное значение Y");
        } else {
            if ( strCompare(textY,-5)>0  && strCompare(textY,5)<0) {
                $("#errorY").fadeTo(0, 0);
                $('#send_form').removeAttr('disabled');
                $("#send_form").css("background-color", "rgb(60, 16, 44)");
                $("#send_form").addClass("changeColor");
            } else {
                wrongValue('Выход за пределы диапазона');
            }
        }
    } else {
        wrongValue('Не введено значение Y');
    }
}

function strCompare( first, second) {
    first = new String(first);
    second = new String(second);
    while (first.length > second.length) {
        if (second.indexOf('.') === false) //если число не вещественное, то добавим .
            second = second+'.';
        second = second+'0'; //конкантенация строк , приведение второго числа к такому же числу знаков после запятой, как у 1
    }
    if  (first.indexOf('-') > -1 && second.indexOf('-') > -1)

        if (first.localeCompare(second) == 0)
            return 0;
        else
            if (first.localeCompare(second) == 1)
                return -1;
            else return 1;

    else
        return first.localeCompare(second);
}



$("#form_input").bind("input", function () {
    textY = $("#form_input").val().replace(",", '.');
    checkY(textY);
});

function wrongValue(value) {
    $("#errorY").attr("data-title", value)
    $("#errorY").fadeTo(500, 1);
    $('#send_form').attr('disabled');
    $("#send_form").css("background-color", "darkgrey");
    $("#send_form").removeClass("changeColor");
}

//отправка
$("#send_form").click(function (event) {
    event.preventDefault();

    $.ajax({
        url: "check.php",
        data: {buttonX: buttonX_value, textY: textY, buttonR: buttonR_value},
        type: 'POST',
        success: function (data) {

            $("#errorX").fadeTo(0, 0);
            $("#errorY").fadeTo(0, 0);
            $("#errorR").fadeTo(0, 0);
            //создание таблицы
            var answer = jQuery.parseJSON(data);
            if ("X" in answer) {
                ctx.clearRect(0, 0, 305, 305); //очистка для перерисовки
                drawGraph();
                drawPoint(); //отмечаем точку
                createTable();
                addRow("table", answer);
            } else {
                if (!answer.checkX) {
                    $("#errorX").fadeTo(500, 1);
                }
                if (!answer.checkY) {
                    checkY(textY);
                }
                if (!answer.checkR) {
                    $("#errorR").fadeTo(500, 1);
                }

            }
        }

    });
    $("firstX").addClass("selected");
    $("firstR").addClass("selected");
    drawGraph();

});

$(document).ready(function() {
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

function createTable() {
    cleanButton.css('display', "inline");
    $("table").css("display", "block");

}

function addRow(id, answer) {
    var row = document.createElement("TR");
    var td1 = document.createElement("TD");
    td1.appendChild(document.createTextNode(answer.X));
    var td2 = document.createElement("TD");
    var innerDiv = document.createElement("div");
    innerDiv.classList.add("tdScroll");
    innerDiv.appendChild(document.createTextNode(answer.Y));
    td2.appendChild(innerDiv);
    var td3 = document.createElement("TD");
    td3.appendChild(document.createTextNode(answer.R));
    var td4 = document.createElement("TD");
    td4.appendChild(document.createTextNode(answer.hit));
    var td5 = document.createElement("TD");
    td5.appendChild(document.createTextNode(answer.currentTime));
    var td6 = document.createElement("TD");
    var time = document.createTextNode((answer.time.toFixed(6) * 100000).toFixed(1) + ' мкс');
    td6.appendChild(time);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    row.appendChild(td6);
    $("tbody").append(row);
}


//отрисовка
var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 305;
myCanvas.height = 305;

var ctx = myCanvas.getContext("2d");

ctx.font = "10px Verdana";
ctx.lineWidth = 1.5; //толщина линий
//НАЧАЛЬНАЯ СИСТЕМА КООРДИНАТ
drawCoordinatePlane();
drawNumbers();
drawGraph();

function drawCoordinatePlane() {

    ctx.beginPath();
    ctx.fillStyle = "rgb(60, 16, 44)";
    ctx.moveTo(0, 150);
    ctx.lineTo(305, 150); //ось ОХ
    ctx.fillText("X", 290, 140);
    //стрелочка на оси ОХ
    ctx.moveTo(305, 150);
    ctx.lineTo(300, 145);
    ctx.moveTo(305, 150);
    ctx.lineTo(300, 155);

    //ось Y
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 305);
    ctx.fillText("Y", 160, 10);
    //стрелочка на оси Y
    ctx.moveTo(150, 0);
    ctx.lineTo(155, 5);
    ctx.moveTo(150, 0);
    ctx.lineTo(145, 5);
    ctx.stroke();

}

function drawNumbers() {
    //деления на ОY
    ctx.beginPath();
    ctx.fillStyle = "rgb(60, 16, 44)";
    ctx.strokeStyle = "rgb(60, 16, 44)";
    ctx.moveTo(145, 5);
    ctx.lineTo(155, 5);
    ctx.fillText(5, 160, 0);
    ctx.moveTo(145, 30);
    ctx.lineTo(155, 30);
    ctx.fillText(4, 160, 33);
    ctx.moveTo(145, 60);
    ctx.lineTo(155, 60);
    ctx.fillText(3, 160, 63);
    ctx.moveTo(145, 90);
    ctx.lineTo(155, 90);
    ctx.fillText(2, 160, 93);
    ctx.moveTo(145, 120);
    ctx.lineTo(155, 120);
    ctx.fillText(1, 160, 123);
    ctx.fillText(0, 140, 163); // ноль в центре координат
    ctx.moveTo(145, 180);
    ctx.lineTo(155, 180);
    ctx.fillText(-1, 160, 183);
    ctx.moveTo(145, 210);
    ctx.lineTo(155, 210);
    ctx.fillText(-2, 160, 213);
    ctx.moveTo(145, 240);
    ctx.lineTo(155, 240);
    ctx.fillText(-3, 160, 243);
    ctx.moveTo(145, 270);
    ctx.lineTo(155, 270);
    ctx.fillText(-4, 160, 273);
    ctx.moveTo(145, 300);
    ctx.lineTo(155, 300);
    ctx.fillText(-5, 160, 303);

    //Деления на OX

    ctx.moveTo(2, 145);
    ctx.lineTo(2, 155);
    ctx.fillText(-5, 0, 163);
    ctx.moveTo(30, 145);
    ctx.lineTo(30, 155);
    ctx.fillText(-4, 25, 163);
    ctx.moveTo(60, 145);
    ctx.lineTo(60, 155);
    ctx.fillText(-3, 55, 163);
    ctx.moveTo(90, 145);
    ctx.lineTo(90, 155);
    ctx.fillText(-2, 85, 163);
    ctx.moveTo(120, 145);
    ctx.lineTo(120, 155);
    ctx.fillText(-1, 115, 163);

    ctx.moveTo(180, 145);
    ctx.lineTo(180, 155);
    ctx.fillText(1, 177, 163);
    ctx.moveTo(210, 145);
    ctx.lineTo(210, 155);
    ctx.fillText(2, 207, 163);
    ctx.moveTo(240, 145);
    ctx.lineTo(240, 155);
    ctx.fillText(3, 237, 163);
    ctx.moveTo(270, 145);
    ctx.lineTo(270, 155);
    ctx.fillText(4, 267, 163);
    ctx.moveTo(300, 145);
    ctx.lineTo(300, 155);
    ctx.fillText(5, 297, 163);

    ctx.stroke();
}

function drawTriangle() {

    ctx.beginPath();
    ctx.moveTo(150 - (buttonR_value * 15), 150);
    ctx.lineTo(150, 150 - buttonR_value * 30);
    ctx.lineTo(150, 150);
    ctx.lineTo(150 - (buttonR_value * 15), 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

function drawSquare() {

    ctx.beginPath();
    ctx.rect(150, 150, buttonR_value * 30, buttonR_value * 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

function drawRectangle() {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, buttonR_value * 15, 0, Math.PI * 3 / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

function drawPoint() {

    ctx.beginPath();
    ctx.arc(150 + buttonX_value * 30, 150 - textY * 30, 1, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
}

function drawGraph() {
    ctx.clearRect(0, 0, 305, 305);
    ctx.fillStyle = "rgb(255, 162, 211)";
    ctx.strokeStyle = "rgb(60, 16, 44)";

    // ctx.strokeRect(0, 0, 305, 305); //отрисовка контура координатной плоскости
    drawCoordinatePlane(); //отрисовка координатных прямых
    ctx.fillStyle = "rgb(255, 162, 211)";
    drawTriangle(); //отрисовка треугольника
    drawSquare(); // отрисовка прямоугольника
    drawRectangle(); //отрисовка сектора
    drawNumbers();
    // drawPoint(); //отмечаем точку

}
