// CONFIG ////////////////
var initialBetAmount = 1;
var mode = 'martingale'; // 'martingale' or 'anti-martingale'
var betColor = 'red'; // can be 'red' or 'black'
//////////////////////////




function run() {
    var a = getStatus();
    if (a !== _lastStatus && "unknown" !== a) {

        switch (a) {
            case "waiting":
                bet();
                break;
            case "rolled":
                rolled();
        }

        _lastStatus = a, printInfo();
    }
}

function checkBalance() {
    return getBalance() < _currentBetAmount ? (console.warn("BANKRUPT! Not enough balance for next bet, aborting."), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() {
    var a = " \nStatus: " + _lastStatus + "\nRolls played: " + _currentRollNbr + "\nInitial bet amount: " + initialBetAmount + "\nCurrent bet amount: " + _currentBetAmount + "\nLast roll result: " + (null === wonLastRoll() ? "-" : wonLastRoll() ? "won" : "lost");
    console.log(a)
}

function rolled() {
    return "anti-martingale" === mode ? void antiMartingale() : (martingale(), void _currentRollNbr++)
}

function antiMartingale() {
    _currentBetAmount = wonLastRoll() ? 2 * _currentBetAmount : initialBetAmount
}

function martingale() {
    _currentBetAmount = wonLastRoll() ? initialBetAmount : 2 * _currentBetAmount
}

function bet() {
    checkBalance() && (setBetAmount(_currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(a) {
    _betAmount.val(a)
}

function placeBet() {
    return "red" === betColor ? (_redBtn.click(), void(_lastBetColor = "red")) : (_blackBtn.click(), void(_lastBetColor = "black"));
}

function getStatus() {
    var a = _status.text();

    if (hasSubString(a, "Rolling in")) {
        return "waiting";
    }

    if (hasSubString(a, "***ROLLING***")) {
    return "rolling";
    }

    if (hasSubString(a, "rolled")) {
        var b = parseInt(a.split("rolled")[1]);
        return _lastBetColor = getColor(b), "rolled";
    }

    return "unknown";
}

function getBalance() {
    return parseInt(_balance.text());
}

function hasSubString(a, b) {
    return a.indexOf(b) > -1;
}

function getColor(a) {
    return 0 == a ? "green" : a >= 1 && 7 >= a ? "red" : "black";
}

function wonLastRoll() {
    return _lastBetColor ? _lastRollColor === _lastBetColor : null;
}

    // vars
var _currentBetAmount = initialBetAmount,
    _currentRollNbr = 1,
    _lastStatus,
    _lastBetColor,
    _lastRollColor,

    // elements
    _balance = $("#balance"),
    _betAmount = $("#betAmount"),
    _status = $(".progress #banner"),
    _redBtn = $("#panel1-7 .betButton"),
    _blackBtn = $("#panel8-14 .betButton"),
    refreshIntervalId = setInterval(run, 500);
