import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'

interface CodingSession {
	id: string,
	project: string,
	workspacePath: string,
	language: string,
	startedAt: string;
	endedAt: string | null;
	durationSeconds: number;
}

interface codeingData {
	totalCodingSeconds: number;
	sessions: CodingSession[];
}

let session: CodingSession | null = null;
let timer: NodeJS.Timeout | null = null;
let extensionContext: vscode.ExtensionContext | null = null;

const IDLE_TIMEOUT_SECONDS = 60;

let lastActivityTime = Date.now();

export function activate(
	context: vscode.ExtensionContext
) {
	extensionContext = context;
	console.log("BAL Coding Tracker Activated...")

	const statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		100
	)

	statusBar.command = "codingTracker.showTime";
	statusBar.show();

	context.subscriptions.push(statusBar)

	const dataFile = getDataFilePath(context)

	initializeDataFile(dataFile);
	updateStatusBar(statusBar);

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(() => {
			registerActivity();
			updateStatusBar(statusBar);
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(() => {
			registerActivity();
			updateStatusBar(statusBar);
		})
	);

	context.subscriptions.push(
		vscode.window.onDidChangeWindowState((state) => {
			if (state.focused) {
				registerActivity();
			} else {
				stopSession();
			}

			updateStatusBar(statusBar);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"codingTracker.showTime",
			() => {
				const data = loadData(dataFile);

				const total = formatDuration(data.totalCodingSeconds);

				vscode.window.showInformationMessage(
					`Total coding time: ${total}`
				);
			}
		)
	);

	timer = setInterval(() => {
		checkActivity(dataFile);
		updateStatusBar(statusBar);
	}, 1000);

	context.subscriptions.push({
		dispose: () => {
			if (timer) {
				clearInterval(timer);
			}

			stopSession();
		}
	});

	if (vscode.window.activeTextEditor) {
		registerActivity();
	}
}


export function deactivate() {
	stopSession();
}

function registerActivity() {
	lastActivityTime = Date.now();

	if (!session) {
		startSession();
	}

	if (session) {
		session.endedAt = null;
	}
}

function startSession() {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	const workspaceFolder = vscode.workspace.getWorkspaceFolder(
		editor.document.uri
	);

	const project = workspaceFolder
		? path.basename(workspaceFolder.uri.fsPath)
		: "No Workspace";

	const workspacePath = workspaceFolder
		? workspaceFolder.uri.fsPath
		: "";

	session = {
		id: randomUUID(),
		project,
		workspacePath,
		language: editor.document.languageId,
		startedAt: new Date().toISOString(),
		endedAt: null,
		durationSeconds: 0
	};
}


function stopSession() {
	if (!session) {
		return;
	}

	if (session.durationSeconds <= 0) {
		session = null;
		return;
	}

	session.endedAt = new Date().toISOString();

	const dataFile = getDataFilePath(
		extensionContext ?? undefined
	);

	saveSession(dataFile, session);

	session = null;
}

function checkActivity(dataFile: string) {
	if (!session) {
		return;
	}

	const now = Date.now();

	const inactiveSeconds = Math.floor((now - lastActivityTime) / 1000);

	if (inactiveSeconds >= IDLE_TIMEOUT_SECONDS) {
		stopSession();
		return;
	}

	session.durationSeconds += 1;
}


function getDataFilePath(
	context?: vscode.ExtensionContext
): string {
	const basePath = context?.globalStorageUri.fsPath ??
		path.join(
			process.env.APPDATA ||
			process.env.HOME ||
			process.cwd(),
			"coding-tracker"
		);

	if (!fs.existsSync(basePath)) {
		fs.mkdirSync(basePath, {
			recursive: true
		});
	}

	return path.join(basePath, "coding-data.json");
}

function initializeDataFile(filePath: string) {
	if (!fs.existsSync(filePath)) {
		const data: codeingData = {
			totalCodingSeconds: 0,
			sessions: []
		};

		fs.writeFileSync(
			filePath,
			JSON.stringify(data, null, 2),
			"utf8"
		);
	}
}

function loadData(filePath: string): codeingData {
	initializeDataFile(filePath);

	try {
		const raw = fs.readFileSync(filePath, "utf8");

		return JSON.parse(raw) as codeingData;
	} catch {
		return {
			totalCodingSeconds: 0,
			sessions: []
		};
	}
}

function saveSession(
	filePath: string,
	newSession: CodingSession
) {
	const data = loadData(filePath);

	data.totalCodingSeconds += newSession.durationSeconds;

	data.sessions.push(newSession);

	fs.writeFileSync(
		filePath,
		JSON.stringify(data, null, 2),
		"utf8"
	);
}


function updateStatusBar(
	statusBar: vscode.StatusBarItem
) {
	if (!session) {
		statusBar.text = "$(clock) Coding: 00:00:00";
		return;
	}

	statusBar.text =
		`$(clock) Coding: ${formatDuration(session.durationSeconds)}`;
}

function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);

	const minutes = Math.floor(
		(seconds % 3600) / 60
	);

	const remainingSeconds = seconds % 60;

	return [
		hours.toString().padStart(2, "0"),
		minutes.toString().padStart(2, "0"),
		remainingSeconds.toString().padStart(2, "0")
	].join(":");
}
