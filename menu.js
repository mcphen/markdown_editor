
const { 
    app, 
    Menu, 
    shell,
    BrowserWindow,
    ipcMain, 
    globalShortcut, 
    dialog } = require('electron');
const fs = require('fs');


// Raccourcis

function saveFile() {
    console.log('Saving the file');
  
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
  }
  
function loadFile() {
    const window = BrowserWindow.getFocusedWindow();
    const files = dialog.showOpenDialogSync(window, {
        properties: ['openFile'],
        title: 'Pick a markdown file',
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown','txt'] }]
  
    });
    if (!files) return;
  
    const file = files[0];
    const fileContent = fs.readFileSync(file).toString();
    console.log(fileContent);
    window.webContents.send('load', fileContent);
  }
  const template = [
    {
        label: 'File',
        submenu: [
          {
            label: 'Open',
            accelerator: 'CommandOrControl+O',
            click() {
              loadFile();
            }
          },
          {
            label: 'Save',
            accelerator: 'CommandOrControl+S',
            click() {
              saveFile();
            }
          }
        ]
    },
    {
        label: 'Format',
        submenu: [
          {
            label: 'Toggle Bold',
            click() {
              const window = BrowserWindow.getFocusedWindow();
              window.webContents.send('editor-event', 'toggle-bold');
            }
          },
          { type: 'separator' },
          {
            label: 'Toggle Italic',
            click() {
              const window = BrowserWindow.getFocusedWindow();
              window.webContents.send('editor-event', 'toggle-italic');
            }
          },
        ]
      },
    {
      role: 'help',
      submenu: [
        {
          label: 'About Editor Component',
          click() {
              shell.openExternal('https://simplemde.com/');
          }
        }
      ]
    },


   
];
ipcMain.on('save', (event, arg) => {
    console.log(`Saving content of the file`);
    console.log(arg);
  
    const window = BrowserWindow.getFocusedWindow();
    const options = {
      title: 'Save markdown file',
      filters: [
        {
          name: 'MyFile',
          extensions: ['md']
        }
      ]
    };
  
    const filename = dialog.showSaveDialogSync(window, options);
    if (filename) {
      console.log(`Saving content to the file: ${filename}`);
      fs.writeFileSync(filename, arg);
    }
});

  app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
      saveFile();
    });

    globalShortcut.register('CommandOrControl+O', () => {
        loadFile();
    });
  });



  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  if (process.env.DEBUG) {
    template.push({
      label: 'Debugging',
      submenu: [
        {
          label: 'Dev Tools',
          role: 'toggleDevTools'
        },
  
        { type: 'separator' },
        {
          role: 'reload',
          accelerator: 'Alt+R'
        }
      ]
    });
  }
  ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
  });


const menu = Menu.buildFromTemplate(template);

  module.exports = menu;