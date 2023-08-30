const { app, BrowserWindow } = require("electron");
const { autoUpdater, AppUpdater } = require("electron-updater");
const { aviso } = require("./src/app/Avisos/avisos.js");


autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
  });
  //win.setMenu(null)  
  win.loadFile("./src/app/Inicio-Login/index.html");

  autoUpdater.checkForUpdates();

};

/*Nueva actualizacion*/
autoUpdater.on("update-available", () => {
  autoUpdater.downloadUpdate();
  aviso("Actualizacion disponible", "warning");
});


// MOSTRAR MENSAJE CUANDO SE ESTE DESCARGANDO LA ACTUALIZACION
autoUpdater.on("update-downloaded", (info) => {
  autoUpdater.quitAndInstall();
  aviso("Actualizacion descargada", "success");
}
);

// actualizacion no disponible
autoUpdater.on("update-not-available", () => {
  aviso("Actualizacion no disponible", "success");
});


app.whenReady().then(() => {
  createWindow();
});
