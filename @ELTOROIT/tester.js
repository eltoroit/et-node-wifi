const wifi = require('et-node-wifi');

let wifiInitialized = false;

async function network() {
  if (!wifiInitialized) {
    // Absolutely necessary even to set interface to null
    wifi.init({ iface: null });
    wifiInitialized = true;
  }

  try {
    console.log('Networks Connected');
    const networksConnected = await wifi.getCurrentConnections();
    networksConnected.forEach(network => {
      console.log(
        `${network.ssid.padEnd(20, '.')} \t ${network.bssid.padEnd(
          20,
          '.'
        )} \t ${network.quality}% \t ${network.signal_level}`
      );
    });

    console.log('Networks Available');
    const networksAvailable = await wifi.scan();
    networksAvailable.sort((a, b) => -(a.quality < b.quality ? -1 : 1));
    networksAvailable.forEach(network => {
      console.log(
        `${network.ssid.padEnd(20, '.')} \t ${network.bssid.padEnd(
          20,
          '.'
        )} \t ${network.quality}% \t ${network.signal_level}`
      );
    });
  } catch (ex) {
    console.log(ex);
    debugger;
  }
}

const execFile = require('child_process').execFile;

function network2() {
  const env = Object.assign(process.env, {
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
    LC_MESSAGES: 'en_US.UTF-8'
  });
  execFile('netsh', ['wlan', 'show', 'interfaces'], env, (err, stdout) => {
    if (err) {
      debugger;
      console.log(err);
    } else {
      // debugger;
      console.log(stdout);
      let lines = stdout.trim().split('\r\n');
      lines = lines.filter(line => line.startsWith('  '));
      lines = lines.map(line => {
        const parts = line.split(' :').map(part => part.trim());
        return { [parts[0]]: parts[1] };
      });
      debugger;
    }
  });
}

network();

// // Initialize wifi module

// // // // Scan networks
// // // wifi.scan((error, networks) => {
// // //   if (error) {
// // //     console.log(error);
// // //   } else {
// // //     console.log(networks);
// // //     /*
// // //         networks = [
// // //             {
// // //               ssid: '...',
// // //               bssid: '...',
// // //               mac: '...', // equals to bssid (for retrocompatibility)
// // //               channel: <number>,
// // //               frequency: <number>, // in MHz
// // //               signal_level: <number>, // in dB
// // //               quality: <number>, // same as signal level but in %
// // //               security: 'WPA WPA2' // format depending on locale for open networks in Windows
// // //               security_flags: '...' // encryption protocols (format currently depending of the OS)
// // //               mode: '...' // network mode like Infra (format currently depending of the OS)
// // //             },
// // //             ...
// // //         ];
// // //         */
// // //   }
// // // });

// // // // Connect to a network
// // // wifi.connect({ ssid: "ssid", password: "password" }, () => {
// // //   console.log("Connected");
// // //   // on windows, the callback is called even if the connection failed due to netsh limitations
// // //   // if your software may work on windows, you should use `wifi.getCurrentConnections` to check if the connection succeeded
// // // });

// // // // Disconnect from a network
// // // // not available on all os for now
// // // wifi.disconnect((error) => {
// // //   if (error) {
// // //     console.log(error);
// // //   } else {
// // //     console.log("Disconnected");
// // //   }
// // // });

// // // // Delete a saved network
// // // // not available on all os for now
// // // wifi.deleteConnection({ ssid: "ssid" }, (error) => {
// // //   if (error) {
// // //     console.log(error);
// // //   } else {
// // //     console.log("Deleted");
// // //   }
// // // });

// // // List the current wifi connections
// // wifi.getCurrentConnections((error, currentConnections) => {
// //   if (error) {
// //     console.log(error);
// //   } else {
// //     console.log(currentConnections);
// //     /*
// //     // you may have several connections
// //     [
// //         {
// //             iface: '...', // network interface used for the connection, not available on macOS
// //             ssid: '...',
// //             bssid: '...',
// //             mac: '...', // equals to bssid (for retrocompatibility)
// //             channel: <number>,
// //             frequency: <number>, // in MHz
// //             signal_level: <number>, // in dB
// //             quality: <number>, // same as signal level but in %
// //             security: '...' //
// //             security_flags: '...' // encryption protocols (format currently depending of the OS)
// //             mode: '...' // network mode like Infra (format currently depending of the OS)
// //         }
// //     ]
// //     */
// //   }
// // });

// // // All functions also return promise if there is no callback given
// // wifi
// //   .scan()
// //   .then((networks) => {
// //     // networks
// //     console.log(networks);
// //     debugger;
// //   })
// //   .catch((error) => {
// //     // error
// //   });

// // List the current wifi connections
// wifi
//   .getCurrentConnections()
//   .then((currentConnections) => {
//     console.log(currentConnections);
//     debugger;
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// // (error, currentConnections) => {
// //   if (error) {
// //   } else {
// //     console.log(currentConnections);
// //     /*
// //       // you may have several connections
// //       [
// //           {
// //               iface: '...', // network interface used for the connection, not available on macOS
// //               ssid: '...',
// //               bssid: '...',
// //               mac: '...', // equals to bssid (for retrocompatibility)
// //               channel: <number>,
// //               frequency: <number>, // in MHz
// //               signal_level: <number>, // in dB
// //               quality: <number>, // same as signal level but in %
// //               security: '...' //
// //               security_flags: '...' // encryption protocols (format currently depending of the OS)
// //               mode: '...' // network mode like Infra (format currently depending of the OS)
// //           }
// //       ]
// //       */
// //   }
// // };
