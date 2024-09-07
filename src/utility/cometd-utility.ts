import {CometD} from "cometd";

// class CustomizedCometD extends CometD {
//     isHandShaked: boolean = false;
//
//     // check if connected
//     while (true) {
//
//
//
// }
//     // if not connected -> wait for a few seconds
//
//     safeSubscribe = () => {
//         // check if connected -> if not reconnect and wait
//         if (!this.isConnected) {
//             setInterval(() => {
//                 console.log('Not connected');
//                 if (this.isConnected) {
//                     break;
//                 }
//             }, 10000);
//         } else {
//
//         }
//
//
//
//         cometd.addListener('/meta/handshake', (message: Message) => {
//             if (message.successful) {
//                 console.log(message)
//             }
//         });
//     }
// }

export const cometd = new CometD();
