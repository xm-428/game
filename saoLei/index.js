var count = {
    first: { rows: 9, columns: 9, leiTotal: 10 },
    seconde: { rows: 16, columns: 16, leiTotal: 40 },
    third: { rows: 16, columns: 30, leiTotal: 99 },
};
var type = 'first';
var rows = count[type].rows;
var columns = count[type].columns;
var leiTotal = count[type].leiTotal;
let grid = [];
const li = document.getElementsByTagName('li');
var gameOver = false;
var activeGridNum = 0;
var timer;
var timing = 0;
var timerStart = false;

function changeGameType(value) {
    type = value;
    reset();
}

function reset() {
    timing = 0;
    timerStart = false;
    clearInterval(timer);
    document.getElementById('time').innerText = '';
    document.getElementById('title').innerText = '';
    gameOver = false;
    rows = count[type].rows;
    columns = count[type].columns;
    leiTotal = count[type].leiTotal;
    init_grid();
}

function randomNum(maxNum) { // 生成随机数
    return parseInt(Math.random() * maxNum);
}

function setTimer() { // 计时器
    console.log('计时器调用', '')
    timer = setInterval(function() {
        timing++;
        document.getElementById('time').innerText = timing;
    }, 1000);
}

function init_grid() { // 创建网格
    document.getElementById("lei").innerHTML = '';
    var lei = '';
    grid = [];
    for (let i = 0; i < rows; i++) {
        lei += '<ul>';
        for (let j = 0; j < columns; j++) {
            lei += '<li id="' + i + '-' + j + '" onmousedown="grid_click(' + i + ',' + j + ',event)">&nbsp;</li>'
            grid.push({ hasLei: false }); // 给每一格标记是否有雷
        }
        lei += '</ul>'
    }
    document.getElementById("lei").innerHTML = lei;
    leiNum();
}

function grid_click(posX, posY, event) {
    if (!timerStart && !gameOver) {
        timerStart = true;
        setTimer();
    }
    if (!gameOver) {
        var active_grid = document.getElementById(posX + '-' + posY);
        if (!active_grid.classList.contains('activeGrid')) { // 未点击过
            if (event) {
                if (event.button == 0 && !active_grid.classList.contains('flag')) { // 鼠标左击 && 未被标记为雷
                    left_click(posX, posY, active_grid);
                } else if (event.button == 2) { // 鼠标右击
                    right_click(active_grid);
                }
            }
        }
    }
}

function left_click(posX, posY, dom) { // 鼠标左击
    if (dom && !dom.classList.contains('isLei')) {
        dom.classList.add('activeGrid'); // 添加 打开 标记
        var number = aroundBoxLeiNumber(posX, posY);
        if (number != 0) {
            dom.innerText = number;
        } else {
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    if (i >= 0 && j >= 0) {
                        number = aroundBoxLeiNumber(i, j);
                        var around_grid = document.getElementById(i + '-' + j);
                        if (around_grid && !around_grid.classList.contains('activeGrid') && !around_grid.classList.contains('flag')) {
                            around_grid.classList.add('activeGrid');
                            if (number != 0) {
                                around_grid.innerText = number;
                            } else {
                                left_click(i, j, around_grid);
                            }
                        }
                    }
                }
            }
        }

        if (document.getElementsByClassName('activeGrid').length === rows * columns - leiTotal) {
            document.getElementById('title').innerText = '成功！';
            gameOver = true;

            timerStart = false;
            clearInterval(timer);
            return;
        }
    } else { // 扫雷失败

        timerStart = false;
        clearInterval(timer);

        document.getElementById('title').innerText = '已猝！';
        gameOver = true;
        fail();
    }
}

function right_click(dom) { // 鼠标右击
    if (dom && !dom.classList.contains('flag')) {
        dom.classList.add('flag'); // 添加 雷 标记
    } else {
        dom.classList.remove('flag'); // 删除 雷 标记
    }
}

function aroundBoxLeiNumber(posX, posY) { // 九宫格中 雷的数量计算
    posX = Number(posX);
    posY = Number(posY);
    let number = 0;
    for (var i = posX - 1; i <= posX + 1; i++) {
        for (var j = posY - 1; j <= posY + 1; j++) {
            var aroundBox = document.getElementById(i + '-' + j);
            if (aroundBox && aroundBox.classList.contains('isLei') && !aroundBox.classList.contains('activeGrid')) {
                number++;
            }

        }
    }
    return number;
}

function leiNum() { // 随机生成雷
    var total = leiTotal;
    while (total) {
        var position = randomNum(rows * columns); // 随机生成（0 - 100）的数
        if (!grid[position].hasLei) {
            li[position].classList.add('isLei');
            grid[position].hasLei = true;
            total--;
        }
    }
}

function fail() {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].hasLei) {
            li[i].classList.add('haveLei');
            li[i].classList.remove('flag');
        }
    }
}

window.onload = function() {
    init_grid();
}