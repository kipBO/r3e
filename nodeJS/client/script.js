const url = "ws://localhost:7070/myWebsocket";
const mywsServer = new WebSocket(url);
console.log('OK:'+mywsServer);

const myMessages = document.getElementById("messages");
const sendBtn = document.getElementById("send")
const myInput = document.getElementById("message")

sendBtn.addEventListener("click", sendMsg, false)
function sendMsg() {
    const text = myInput.value
    msgGeneration(text, "Client")
    mywsServer.send(text)
}

function msgGeneration(msg, from) {
    const newMessage = document.createElement("h5");
    newMessage.innerText = `${from} says: ${msg}`;
    myMessages.appendChild(newMessage);
}

mywsServer.onmessage = function(event) {
    const { data } = event;
	let schema = JSON.parse(data);
    //console.log(schema); // is die "schema" van de api
	for (let item of data) {
		console.log(item);
		msgGeneration(item, "Server");
	}
    //msgGeneration(schema, "Server");
	console.log('ok');
}
