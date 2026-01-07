const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  console.log('Electron app is ready. Creating window...');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
