<template>
  <div class="chat-window">
    <h3>{{ chat.name }}</h3>
    <div class="messages">
      <div v-for="message in chat.messages" :key="message.id">
        <strong>{{ message.sender }}:</strong> {{ message.text }}
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>

<script>
export default {
  name: "ChatWindow",
  props: {
    chat: Object,
  },
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.$emit('sendMessage', {
          text: this.newMessage,
        })
        this.chat.messages.push({
          id: Date.now(),
          sender: "You",
          text: this.newMessage,
        });
        this.newMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.chat-window {
  padding: 15px;
  height: calc(100vh - 60px);
}

.chat-window .messages {
  max-height: 300px;
  overflow-y: auto;
}

.chat-window input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: #ff1a1a;
}
</style>