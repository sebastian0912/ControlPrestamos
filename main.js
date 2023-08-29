const { app, BrowserWindow } = require("electron");
require('update-electron-app')()



const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
  });
  win.setMenu(null)  
  win.loadFile("./src/app/Inicio-Login/index.html");
};

app.whenReady().then(() => {
  createWindow();
});
