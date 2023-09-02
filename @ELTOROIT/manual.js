import { execFile } from "child_process";

export default class WIFI {
	getCurrentConnections() {
		return new Promise((resolve, reject) => {
			let connections = [];
			const env = Object.assign(process.env, {
				LANG: "en_US.UTF-8",
				LC_ALL: "en_US.UTF-8",
				LC_MESSAGES: "en_US.UTF-8",
			});
			execFile("netsh", ["wlan", "show", "interfaces"], env, (err, stdout) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.parseShowInterfaces(stdout));
				}
			});
		});
	}

	parseShowInterfaces(stdout) {
		let connections = [];

		// Group stdout by interfaces based on the spaces in the output (empty lines)
		let groups = [];
		let currentGroup = 0;
		let data = stdout.trim().split("\r\n");
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
				const parts = line.split(" :").map((part) => part.trim());
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
