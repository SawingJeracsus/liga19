<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/main.css">
  <script
  src="https://code.jquery.com/jquery-3.5.0.min.js"
  integrity="sha256-xNzN2a4ltkB44Mc/Jz3pT4iU1cmeR0FkXs4pru/JxaQ="
  crossorigin="anonymous"></script>
  <title>Fighting</title>
</head>
<body>

  <div class="fighters">
    <div class="fighter">
      <img class="fighter_portret" src="img/monster1.png" alt="fighter">
      <div class="hp-bar__container">
        <canvas id="hp_container1"></canvas>
      </div>
      <div class="ataks">
              <div class="atak"><button class="atak_btn" id="heal">Лікування</button></div>
              <div class="atak"><button class="atak_btn" id="tailpunch">Удар хвостом</button></div>
              <div class="atak"><button class="atak_btn" id="byte">Укус</button></div>
      </div>
    </div>
    <div id="console">
      <h1>Журнал битви</h1>
    </div>
    <div class="fighter">
      <img class="fighter_portret" src="img/monster2.jfif" alt="fighter">
      <div class="hp-bar__container">
        <canvas id="hp_container2"></canvas>
      </div>
      <div class="ataks">
            <div class="atak"><button class="atak_btn" id="scream">Кхгик</button></div>
            <div class="atak"><button class="atak_btn" id="pressing">Пхгесування</button></div>
            <div class="atak"><button class="atak_btn" id="charge">Хгивок</button></div>
      </div>
    </div>
  </div>

  <script src="js/app.js" charset="utf-8"></script>
  <script>
    var game = new Game([
      new Fighter(
        "Монстр1",
        new HpBar('hp_container1', 150),
        [
          new Atak('heal', 'Лікуваня', -30, 1),
          new Atak('tailpunch', 'Удар звостом', 5, 0.2),
          new Atak('byte', 'Укус', 15, 0.9)
        ]
      ),
      new Fighter(
        "Монстр 2",
        new HpBar('hp_container2', 100),
        [
          new Atak('scream', 'Крик', 80, 3),
          new Atak('pressing', 'Пресування', 2, 0.1),
          new Atak('charge', 'Ривок', 2, 0.1)
        ]
      )
    ], new GameConsole('console'));
  </script>
</body>
</html>
