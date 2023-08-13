const { app, BrowserWindow } = require("electron");



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
