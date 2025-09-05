const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { markAttendance, getStudentNames } = require('./markAttendance');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // Send student names to renderer
    win.webContents.once('did-finish-load', async () => {
        const names = await getStudentNames();
        win.webContents.send('student-names', names);
    });
}

app.whenReady().then(createWindow);

ipcMain.on('submit-names', async (event, selectedNames) => {
    try {
        await markAttendance(selectedNames);
        event.reply('done', 'Attendance updated!');
    } catch (error) {
        console.error('Error marking attendance:', error);
        event.reply('done', 'Failed to update attendance. See console for details.');
    }
});