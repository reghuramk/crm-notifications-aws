/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
const config = { pushKey: "sxL1rHx6m89aJNNs7YjiGoesC8dQqux3Al6AqmVZKQs" };

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
subscribe("news");

export default async function subscribe(topic) {
    swReg = await navigator.serviceWorker.register("/sw.js");
    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(config.pushKey),
    });
  }

self.addEventListener("push", function (event) {
  const message = event.data.json();
  self.registration.showNotification( message.title, { body: message.text });
})
