let stompClient = null;

function connect() {
    let socket = new SockJS('http://localhost:8080/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function () {
        stompClient.subscribe('/topic/messages', function (messageOutput) {
            showMessage(JSON.parse(messageOutput.body));
        });
    });
}

function sendMessage() {
    let from = document.getElementById("username").value;
    let text = document.getElementById("messageInput").value;
    if (from && text) {
        stompClient.send("/app/sendMessage", {}, JSON.stringify({ 'from': from, 'text': text }));
        document.getElementById("messageInput").value = "";
    }
}

function showMessage(message) {
    let messages = document.getElementById("messages");
    let me = document.getElementById("username").value;
    let div = document.createElement("div");
    div.className = "message " + (message.from === me ? "me" : "other");
    div.textContent = message.from + ": " + message.text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

connect();
