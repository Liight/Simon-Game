  var col_green = "#00CC00",
    col_red = "#FF0000",
    col_yellow = "#FFFF00",
    col_blue = "#0000FF",
    col_lg = "#80ff80",
    col_lr = "#ff8080",
    col_ly = "#ffff80",
    col_lb = "#8080ff",

    green = document.getElementById("green"),
    red = document.getElementById("red"),
    yellow = document.getElementById("yellow"),
    blue = document.getElementById("blue"),
    start = document.getElementById("start_button"),
    strict = document.getElementById("strict_button"),
    counter = document.getElementById("counter_count"),
    strict_led = document.getElementById("strict_led"),
    mySwitch = document.getElementById("switch"),
    btn = document.getElementById("button"),

    gAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    rAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    yAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    bAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),

    isOn = false,
    isStrict = false,
    loopNumber = 0,
    canStrict = true,
    colors = [green, red, yellow, blue],
    list = [],
    colorsPressed = [],
    isPlayable = false,
    getWrong = false,
    timer = 1500,
    revTimer = 1000;

  function onOff() { // control function for btn switch
    if (isOn) {
      btn.style.float = "left";
      isOn = false;
      ClearAll();
      if (isStrict) {
        strict_led.style.backgroundColor = "black";
        isStrict = false;
      }
    } else {
      btn.style.float = "right";
      isOn = true;
      chooseColors();
    }
  }

  function strictMode() { // no errors allowed
    if (isOn && canStrict) {
      if (isStrict) {
        strict_led.style.backgroundColor = "black";
        isStrict = false;
      } else {
        strict_led.style.backgroundColor = "#F3F781";
        isStrict = true;
      }
    } else if (!canStrict && isOn && !isStrict) {
      alert("You can't play in Strict Mode if you already win the 1st turn.");
    } else if (!canStrict && isOn && isStrict) {
      alert("You can't play in Normal Mode if you already win the 1st turn in Strict Mode.");
    }
  }

  function playGame() { // play the game
    isPlayable = false;

    if (!getWrong) {
      loopNumber++;

      if (loopNumber > 20) { // winning condition
        alert("YOU WIN!!!");
        startGame();
        return;
      }

      chooseColors();
    }

    if (loopNumber < 10) {
      counter.textContent = "0" + loopNumber;
    } else {
      counter.textContent = loopNumber;
    }

    if (loopNumber > 1) {
      canStrict = false;
    } else {
      canStrict = true;
    }

    var i = 0;
    var time = 0;
    colorsPressed = [];

    loop = window.setInterval(function() { // select a color, highlight and play sound
      var id = list[i].id;
      switch (id) {
        case "green":
          list[i].style.backgroundColor = col_lg;
          gAudio.play();
          break;

        case "red":
          list[i].style.backgroundColor = col_lr;
          rAudio.play();
          break;

        case "yellow":
          list[i].style.backgroundColor = col_ly;
          yAudio.play();
          break;

        case "blue":
          list[i].style.backgroundColor = col_lb;
          bAudio.play();
          break;
      }

      revertColor(i);

      i++;
      if (i >= loopNumber) { // sets an incremental mechanic to the speed at which colors are shown
        window.clearInterval(loop);
        setTimeout(function() {
          getWrong = false;
          colorsPressed = [];
          isPlayable = true;
        }, timer - 150);
        if (loopNumber == 4) {
          timer = 1250;
          revTimer = 900
        } else if (loopNumber == 8) {
          timer = 950;
          revTimer = 750
        } else if (loopNumber == 12) {
          timer = 650;
          revTimer = 450
        }
      }

    }, timer);
  }

  function chooseColors() { // chooses random colours for the colours array
    var num = Math.floor((Math.random() * 4));
    list.push(colors[num]);
  }

  function startGame() { // starts the game
    if (isOn) {
      console.log("touch start on");
      ClearAll();
      playGame();
    }
  }

  function revertColor(i) { // reverts all panels to their original colors
    setTimeout(function() {
      switch (list[i].id) {
        case "green":
          list[i].style.backgroundColor = col_green;
          break;

        case "red":
          list[i].style.backgroundColor = col_red;
          break;

        case "yellow":
          list[i].style.backgroundColor = col_yellow;
          break;

        case "blue":
          list[i].style.backgroundColor = col_blue;
          break;
      }
    }, revTimer);
  }

  function makeSelection(value) { // handles the logic when a player makes a selection
    var equals = false;
    if (isOn) {
      if (isPlayable) {
        switch (value) {
          case 1:
            colorsPressed.push(green);
            green.style.backgroundColor = col_lg;
            gAudio.play();
            setTimeout(function() {
              green.style.backgroundColor = col_green;
            }, 500);
            break;

          case 2:
            colorsPressed.push(red);
            red.style.backgroundColor = col_lr;
            rAudio.play();
            setTimeout(function() {
              red.style.backgroundColor = col_red;
            }, 500);
            break;

          case 3:
            colorsPressed.push(yellow);
            yellow.style.backgroundColor = col_ly;
            yAudio.play();
            setTimeout(function() {
              yellow.style.backgroundColor = col_yellow;
            }, 500);
            break;

          case 4:
            colorsPressed.push(blue);
            blue.style.backgroundColor = col_lb;
            bAudio.play();
            setTimeout(function() {
              blue.style.backgroundColor = col_blue;
            }, 500);
            break;
        }

        for (var i = 0; i < colorsPressed.length; i++) { // runs logic when a panel is pressed
          if (colorsPressed[i] != list[i]) {
            counter.textContent = "!!";
            isPlayable = false;
            setTimeout(function() {
              if (isStrict) {
                startGame();
              } else {
                getWrong = true;
                playGame();
              }
            }, 2000);
          }
        }

        for (var i = 0; i < list.length; i++) { // checks for correct color selection
          if (colorsPressed[i] == list[i]) {
            equals = true;
          } else {
            equals = false
          }
        }

        if (equals) { // continues if no errors are made
          playGame()
        }
      }
    }
  }

  function ClearAll() { // Resets colours and variables for a new game
    if (typeof loop !== "undefined") {
      window.clearInterval(loop);
    }
    green.style.backgroundColor = col_green;
    red.style.backgroundColor = col_red;
    yellow.style.backgroundColor = col_yellow;
    blue.style.backgroundColor = col_blue;
    list = [];
    colorsPressed = [];
    loopNumber = 0;
    counter.textContent = "--";
    isPlayable = false;
    timer = 1500;
    revTimer = 1000;
    canStrict = true;
  }