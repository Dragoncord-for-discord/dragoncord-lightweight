console.log('[Dragoncord] Please wait, we are loading :)');

// Libs
const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	session,
	ipcMain,
	ipcRenderer,
	desktopCapturer,
	Notification,
	nativeImage
} = require('electron');
delete require('electron').nativeImage.createThumbnailFromPath;

// Settings
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('enable-webrtc-h264-with-openh264-ffmpeg');

process.env.WebRTCPipeWireCapturer = 1;
process.env.PULSE_LATENCY_MSEC = 30;
//process.env.PIPEWIRE_LATENCY = 30;
//process.env.ELECTRON_ENABLE_LOGGING = 1;

console.log('Dragoncord By DragonFire | Web Client');
// Window
function createWindow() {
	const main = new BrowserWindow({
		width: 1280,
		height: 720,
		icon: "app.ico",
		center: true,
		webPreferences: {
			title: "Dragoncord"
		}
	});

	Menu.setApplicationMenu(null);

	// WebRTC and Voice
	main.webContents.setWebRTCIPHandlingPolicy("default_public_and_private_interfaces")
	session.fromPartition("default").setPermissionRequestHandler((webContents, permission, callback) => { callback(true); });

	// Anti-Telemetry
	main.webContents.session.webRequest.onBeforeRequest(
		{
			urls: [
				//'https://*/api/*/channels/*/typing',
				'https://*/api/*/science',
				'https://*/api/*/track'

				//'https://*/assets/92f72ff03a9f9354db89.js',
				//'https://*/assets/c3b2982aa8e45f9d42df.js',
				//'https://*/bad-domains/hashes.json',
				//'https://*/api/v9/applications/detectable'
			]
		},
		(details, callback) => {
			const url = new URL(details.url);
			if (url.pathname.endsWith('/science') || url.pathname.endsWith('/track')) { console.debug('[Anti-Telemetry] Blocking ' + url.pathname); return callback({ cancel: true }); }
			//else if (url.pathname.endsWith('/typing')) { console.debug('[Dragoncord] Typing disabled: ' + url.pathname); return 0;}
			else { console.debug('[Anti-Telemetry] Blocking ' + url.pathname); return callback({ cancel: true }); }
		},
	);

	console.log('[Discord] Loading Discord');
	main.loadURL("https://discord.com/app");
}


// Load App
app.whenReady().then(() => {
	console.log("[Electron JS] App is ready! Starting...");
	// Tray
	tray = new Tray("tray.png");
	const contextMenu = Menu.buildFromTemplate([
		{ label: "Dragoncord", enabled: false, icon: 'tray.png' },
		{ type: "separator" },
		{ label: 'Relaunch', click: function () { app.quit(); app.relaunch(); } },
		{ label: 'Acknowledgements', click: function () { open('https://discord.com/acknowledgements'); } },
		{ type: "separator" },
		{ label: 'Quit Dragoncord', click: function () { app.quit(); } }
	])
	tray.setToolTip("Dragoncord");
	tray.setTitle("Dragoncord");
	tray.setContextMenu(contextMenu);

	createWindow();
});