import { execFile } from "child_process";

export default class WIFI {
	async getCurrentConnections() {
		if (process.platform === "darwin") {
			return await this.getCurrentConnections_MAC();
		} else {
			return await this.getCurrentConnections_WIN();
		}
	}

	async getCurrentConnections_MAC() {
		// networksetup -getairportnetwork en0
		// const stdout = await this.execute({ command: "networksetup", params: ["-getairportnetwork", "en0"], env: process.env });

		// /System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport -I
		const stdout = await this.execute({ command: "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport", params: ["-I"], env: process.env });
		const connections = this.parseShowInterfaces(stdout);
		return connections;
	}

	async getCurrentConnections_WIN() {
		const env = Object.assign(process.env, {
			LANG: "en_US.UTF-8",
			LC_ALL: "en_US.UTF-8",
			LC_MESSAGES: "en_US.UTF-8"
		});

		const stdout = await this.execute({ command: "netsh", params: ["wlan", "show", "interfaces"], env });
		const connections = this.parseShowInterfaces(stdout);
		return connections;
	}

	async execute({ command, params, env }) {
		return new Promise((resolve, reject) => {
			execFile(command, params, env, (err, stdout) => {
				if (err) {
					reject(err);
				} else {
					resolve(stdout);
				}
			});
		});
	}

	parseShowInterfaces(stdout) {
		let connections = [];

		// Group stdout by interfaces based on the spaces in the output (empty lines)
		let groups = [];
		let currentGroup = 0;
		let data = stdout.trim().split("\n");
		data.forEach((line) => {
			line = line.trim();
			if (line === "") {
				currentGroup++;
			} else {
				let items = [];
				if (groups[currentGroup]) {
					items = groups[currentGroup];
				}
				items.push(line);
				groups[currentGroup] = items;
			}
		});
		groups = groups.filter((group) => group.length > 1);

		// Parse each group
		connections = groups.map((group) => {
			let connection = {};
			group.forEach((line) => {
				const parts = line.split(": ").map((part) => part.trim());
				const key = parts[0];
				connection[key] = parts[1];
			});

			return connection;
		});

		return connections;
	}
}

const wifi = new WIFI();
wifi.getCurrentConnections().then((connections) => {
	console.log(connections);
	debugger;
});
