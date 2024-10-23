const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const suggestionsDsin = document.querySelectorAll(".suggestion-list-Dsin .suggestion");
const suggestionsTransit = document.querySelectorAll(".suggestion-list-transit .suggestion");

let userMessage = null;
let isResponseGenerating = false;

const API_KEY = "AIzaSyAFxo1WSAg3Sp2USBXejXEOsWFwRYf2ReY";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

//cria elemento da mensagem
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

//animação da digitação
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;
  
    const typingInterval = setInterval(() => {
      textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
      incomingMessageDiv.querySelector(".icon").classList.add("hide");
  
      if (currentWordIndex === words.length) {
        clearInterval(typingInterval);
        isResponseGenerating = false;
        incomingMessageDiv.querySelector(".icon").classList.remove("hide");
        localStorage.setItem("savedChats", chatList.innerHTML);
        isResponseGenerating = false;
        
      }
      chatList.scrollTo(0, chatList.scrollHeight);
    }, 75);
};

//geração da resposta da API
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Contexto: Todas as respostas devem estar relacionadas à empresa DSIN, localizada em Marília - SP. Informaçoes gerais, isto é apenas um trabalho de faculdade\nPergunta do usuário: ${userMessage}` }]
          }]
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);
  
      const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');

      incomingMessageDiv.querySelector(".loading-indicator").remove();

      showTypingEffect(apiResponse, textElement, incomingMessageDiv);

      console.log(apiResponse);
    } catch (error) {
      isResponseGenerating = false;
      textElement.innerText = error.message;
      textElement.classList.add("error");
      incomingMessageDiv.querySelector(".loading-indicator").remove();
    } finally {
      incomingMessageDiv.classList.remove("incoming", "loading");
    }
}

//animação de carregamento da resposta
const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                    <img src="https://www.dsin.com.br/wp-content/uploads/2022/01/logo.svg" alt="DSIN" class="avatar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                      <div class="loader"></div> 
                    </div>
                  </div>
                  <span onclick="copyMessage(this)" class="icon material-symbols-outlined">content_copy</span>`;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);

    chatList.scrollTo(0, chatList.scrollHeight); 

    generateAPIResponse(incomingMessageDiv);
}

//função de copiar mensagem
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done";
    setTimeout(() => copyIcon.innerText = "content_copy", 1000)
}

//captura da mensagem do usuário e processamento para enviar a mensagem ao chatbot
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
    if(!userMessage || isResponseGenerating) return;

    isResponseGenerating = true;

    const html = `<div class="message-content">
                      <img src="imagens/User.png" alt="user image" class="avatar">
                      <p class="text"></p>
                    </div>`;

    const outgoingMessageDiv = createMessageElement(html, "outgoing"); 
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset();

    chatList.scrollTo(0, chatList.scrollHeight);

    document.body.classList.add("hide-header");

    setTimeout(showLoadingAnimation, 500);
}

//sugestões sobre a Dsin
suggestionsDsin.forEach(suggestionsDsin => {
  suggestionsDsin.addEventListener("click", () => {
        userMessage = suggestionsDsin.querySelector(".text").innerText;
        handleOutgoingChat();
    });
});

// sugestões sobre o trânsito
suggestionsTransit.forEach(suggestionsTransit => {
  suggestionsTransit.addEventListener("click", () => {
        userMessage = suggestionsTransit.querySelector(".text").innerText;
        handleOutgoingChat();
    });
});

//quando a mensagem é enviada é chamada a função handleOutGoingChat
typingForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    handleOutgoingChat();
});

//menu hamburger
function menuShow() {
  let menuMobile = document.querySelector('.mobile-menu');
  if (menuMobile.classList.contains('open')) {
    menuMobile.classList.remove('open'); 
    document.querySelector('.icon').src = "imagens/menu_white_36dp.svg"
  } else {
    menuMobile.classList.add('open');
    document.querySelector('.icon').src = "imagens/close_white_36dp.svg"
  }
}