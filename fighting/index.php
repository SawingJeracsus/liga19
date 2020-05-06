<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/main.css">
  <script
  src="js/jquery-3.5.0.min.js"></script>
  <title>Fighting</title>
</head>
<body>

  <div class="fighters">
    <div class="fighter">
      <img class="fighter_portret" src="img/bodya.jpg" alt="fighter">
      <div class="hp-bar__container">
        <canvas id="hp_container1"></canvas>
      </div>
      <div class="status-bar__container">
            <div id="status_bar1">
            </div>
      </div>
      <div class="ataks">
              <div class="atak"><button class="atak_btn" id="dreamview">Соний погляд</button></div>
              <div class="atak"><button class="atak_btn" id="hairpunch"> Волосяний хлист</button></div>
              <div class="atak"><button class="atak_btn" id="couldownbuff">Зменшення кулдауну</button></div>
              <div class="atak"><button class="atak_btn" id="leaking">Зализування ран</button></div>
              <div class="atak"><button class="atak_btn" id="atakdebuff">Дебаф Атаки</button></div>
              <div class="atak"><button class="atak_btn" id="atakbuff">Баф Атаки</button></div>
      </div>
    </div>
    <div id="console">
      <h1>Журнал битви</h1>
    </div>
    <div class="fighter">
      <img class="fighter_portret" src="img/youlia.jpg" alt="fighter">
      <div class="hp-bar__container">
        <canvas id="hp_container2"></canvas>
      </div>
      <div class="status-bar__container">
            <div id="status_bar2">
            </div>
      </div>
      <div class="ataks">
            <div class="atak"><button class="atak_btn" id="scream">Кхгик</button></div>
            <div class="atak"><button class="atak_btn" id="pressing">Пхгесування</button></div>
            <div class="atak"><button class="atak_btn" id="couldowndebuff">Збільшення кулдауну</button></div>
            <div class="atak"><button class="atak_btn" id="heal">Вилікування</button></div>
            <div class="atak"><button class="atak_btn" id="hpdebuff">ХП дебаф</button></div>
            <div class="atak"><button class="atak_btn" id="hpbuff">Баф ХП</button></div>
      </div>
    </div>
  </div>

  <script src="js/app.js" charset="utf-8"></script>
  <script>
    var game = new Game([
      new Fighter(
        "Бодя",
        new HpBar('hp_container1', 100),
        new StatusBar('status_bar1', '1'),
        [
          new Atak('dreamview', 'Сонний погляд', 30, 3, '1'), // new Atak (id кнопки, назва атаки, шкода, перезарядка, кнопка(не обов'язково), конфіг(не обов'язково))
          new Atak('hairpunch', 'Волосяний хлист', 15, 6, '2'),
          new CoulDownBuff('couldownbuff', '-Кулдаун', '3', 12, 0.5, 7),
          new Atak('leaking', 'Зализування ран', -15, 4, '4'),
          new AtakDebuff('atakdebuff', '-Шкода', '5', 12, 15, 7),
          new AtakBuff('atakbuff', '+Шкода', 'o', 12, 15, 7), // id, name, key, couldown, buff, delay
        ]
      ),
      new Fighter(
        "Юля",
        new HpBar('hp_container2', 100),
        new StatusBar('status_bar2', '2'),
        [
          new Atak('scream', 'Крик', 60, 9, 'm'),
          new Atak('pressing', 'Пресування', 2, 1, 'a'),
          new CouldownDebuff('couldowndebuff', '+Кулдаун', 'f', 12, 2, 7),
          new Atak('heal', 'Вилікування', -10, 3,  '0', {repyting: 3, repytingDelay: 3}),
          new HpDebuff('hpdebuff', '-max ХП', 'i', 12, -20, 10),
          new HpBuff('hpbuff', '+max ХП', 'l', 12, 20, 7) // id, name, key, couldown, buff, delay
        ]
      )
    ], new GameConsole('console'));
  </script>
</body>
</html>
