const express = require('express');
const app = express();
const portNumber = 8000;

// 靜態檔案給瀏覽器
app.use(express.static(__dirname));

// 開啟 server
app.listen(portNumber, () => {
  console.log(`Server running at http://localhost:${portNumber}`);
});


//跟arduino 互動的
const { SerialPort } = require('serialport');  // 注意這裡的解構寫法！

const arduinoPort = new SerialPort({
  path: 'COM5',      // 修改為你的 Arduino Port
  baudRate: 9600
});

app.get('/motor/:status', (req, res) => {
  const status = req.params.status; // 讀到 on 或 off
  if (status === 'up') {
    arduinoPort.write('up\n');
    res.send('motor up');
  } else if (status === 'down') {
    arduinoPort.write('down\n');
    res.send('motor down');
  } else if (status === 'still') {
    arduinoPort.write('still\n');
    res.send('motor still');
  } 
  else {
    res.send('指令錯誤');
  }
});