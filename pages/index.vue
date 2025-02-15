<template>
    <div class="app">
        <UNotifications />
        <div class="login-container" v-if="!connect">
            <h1>Entering into messager</h1>
            <form @submit.prevent="handleConnect">
                <input type="text" class="form-control" placeholder="Enter Username" v-model="username">
                <NuxtLink to=""><button class="btn btn-primary">Enter to chat</button></NuxtLink>
            </form>
        </div>
        <Sidebar v-if="connect" />
        <div class="content" v-if="connect">
            <ChatList :chats="chats" @chat-selected="setSelectedChat" />
            <ChatWindow v-if="selectedChat" :chat="selectedChat" @send-message="sendMessage" />
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import ChatList from '~/components/ChatList.vue';
import ChatWindow from '~/components/ChatWindow.vue';
import Sidebar from '~/components/Sidebar.vue';

export default {
    name: "App",
    components: {
        Sidebar,
        ChatList,
        ChatWindow,
    },
    data() {
        return {
            chats: [
                { id: 1, name: "Anton", messages: [] },
                { id: 2, name: 'Zack', messages: [] }
            ],
            messages: [],
            selectedChat: null,
            username: '',
            connect: false
        };
    },
    methods: {
        setSelectedChat(chat) {
            this.selectedChat = chat;
            this.loadMessages();
        },
        async loadMessages() {
            let { data } = await useFetch(`/api/messages/${this.username}?sender=${this.selectedChat.name}`)
            this.selectedChat.messages = data
        },
        handleConnect() {
            if (this.username.length > 0) {
                const toast = useToast()
                this.connect = true
                this.socket = io('ws://localhost:3000');
                this.socket.emit('logged_in', { username: this.username })
                this.socket.on('chat message', (data) => {
                    this.chats.find(chat => chat.name === data.sender).messages.push({ text: data.text, sender: data.sender, receiver: data.receiver })
                    toast.add({ title: this.username, description: data.text });
                })
            }
        },

        sendMessage(data) {
            this.socket.emit('chat message', { sender: this.username, text: data.text, receiver: this.selectedChat.name })
        },
    },
};
</script>

<style scoped>
.app {
    display: flex;
}

.content {
    flex: 1;
    display: flex;
}

.login-container {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.login-container h1 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #333;
}

.login-container input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;
}

.login-container input:focus {
    border-color: #007bff;
}


.login-container button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-container button:hover {
    background-color: #0056b3;
}
</style>