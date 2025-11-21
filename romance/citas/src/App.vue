<template>
  <div class="iphone-frame">
    <div class="iphone-notch"></div>

    <!-- PANTALLA DE BLOQUEO -->
    <div v-if="pantalla === 'bloqueo'" class="lock-screen">
      <div class="lock-time">{{ hora }}</div>
      <div class="lock-sub">Desliza o presiona el botón para desbloquear</div>

      <div class="home-button" @click="desbloquear">
        <div class="home-circle">◯</div>
      </div>
    </div>

    <!-- HOME SCREEN estilo iPhone -->
    <div v-if="pantalla === 'inicio'" class="home-screen-ios">
      <div class="ios-grid">
        <div class="ios-icon" @click="abrirApp('objetinder')">
          <div class="ios-icon-img"><div class="emoji-icon">✨</div></div>
          <p>Objetinder</p>
        </div>

        <div class="ios-icon" v-for="(ic, idx) in fakeIcons" :key="idx">
          <div class="ios-icon-img"><div class="emoji-icon">{{ ic.emoji }}</div></div>
          <p>{{ ic.name }}</p>
        </div>
      </div>
    </div>

    <!-- APP Objetinder -->
    <div v-if="pantalla === 'objetinder'" class="app">
      <transition name="icon-fade">
        <div v-if="mostrandoIcono" class="app-launch-icon"><div class="emoji">✨</div></div>
      </transition>

      <div v-show="!mostrandoIcono" class="tinder-area">
        <header class="hero">
          <h1>✨ Objetinder ✨</h1>
          <p>Donde los objetos inanimados encuentran su media naranja (literalmente)</p>
        </header>

        <div class="card-stage">
          <div 
            v-if="currentObj"
            ref="cardEl"
            class="card tinder-card"
          >
            <div class="img-card">
              <img :src="currentObj.img" :alt="currentObj.nombre" />
              <div class="card-badges">
                <button class="badge chat-badge" @click.stop="abrirChat(currentObj)">💬</button>
              </div>
            </div>

            <div class="card-body">
              <h2>{{ currentObj.nombre }}</h2>
              <p class="humor">{{ currentObj.humor }}</p>
            </div>
          </div>

          <div v-else class="no-more">
            <h3>Se acabaron los objetos 😢</h3>
            <p>Puedes reiniciar o volver al inicio.</p>
            <div class="no-more-actions">
              <button class="btn-match" @click="resetDeck">Reiniciar</button>
              <button class="btn-close volver" @click="volverInicio">🏠 Inicio</button>
            </div>
          </div>
        </div>

        <!-- Buttons estilo Tinder -->
        <div class="controls">
          <button class="control reject" @click="reject()">❌</button>
          <button class="control like" @click="like()">❤️</button>
        </div>

        <!-- MATCH POPUP -->
        <transition name="fade">
          <div v-if="matchActual" class="match-popup">
            <h3>💞 ¡Match encontrado! 💞</h3>
            <p>{{ matchActual.frase }}</p>
            <button @click="closeMatch" class="btn-close">Cerrar</button>
          </div>
        </transition>

        <!-- CHAT -->
        <transition name="fade">
          <div v-if="chatActivo" class="chat-box">
            <h3>💬 Conversando con {{ chatActivo.nombre }}</h3>

            <div class="chat-messages" ref="chatMessages">
              <div v-for="(msg, i) in mensajes" :key="i" :class="msg.tipo">{{ msg.texto }}</div>
            </div>

            <div class="chat-input">
              <input v-model="entrada" placeholder="Escribe algo..." @keyup.enter="enviarMensaje" />
              <button @click="enviarMensaje">Enviar</button>
            </div>

            <button class="btn-close" @click="cerrarChat">Cerrar chat</button>
          </div>
        </transition>

        <button class="btn-close volver" @click="volverInicio">🏠 Volver</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const pantalla = ref("bloqueo");
const mostrandoIcono = ref(false);
const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function desbloquear() { pantalla.value = 'inicio'; }

const fakeIcons = [
  { name: "Cámara", emoji: "📷" },
  { name: "Mensajes", emoji: "💬" },
  { name: "Fotos", emoji: "🖼️" },
  { name: "Notas", emoji: "📝" },
  { name: "Mail", emoji: "✉️" },
  { name: "Ajustes", emoji: "⚙️" },
  { name: "Clima", emoji: "☀️" }
];

function abrirApp(app) {
  if (app === "objetinder") {
    mostrandoIcono.value = true;
    pantalla.value = app;
    setTimeout(() => (mostrandoIcono.value = false), 700);
  } else pantalla.value = app;
}

function volverInicio() { pantalla.value = "inicio"; }

const objetosData = [
  { nombre: "Batidora Fiestera", img: "./imagenes/batidora.png", humor: "Si no hay música, yo la pongo." },
  { nombre: "Bota Perdida", img: "./imagenes/bota.png", humor: "Estoy buscando a mi media… ¿me ayudas?" },
  { nombre: "Calcetín Perdido", img: "./imagenes/calcetin.png", humor: "Desde la lavadora no volví a ser el mismo…" },
  { nombre: "Control Remoto Perfeccionista", img: "./imagenes/control.png", humor: "Tengo botones… pero contigo pierdo el control." },
  { nombre: "Cuchara Existencial", img: "./imagenes/cuchara.png", humor: "¿Seré una cuchara… o un reflejo de algo más profundo?" },
  { nombre: "Espejo Vanidoso", img: "./imagenes/espejo.png", humor: "Mírame… digo… mírate." },
  { nombre: "Cuchillo Angustiado", img: "./imagenes/cuchillo.png", humor: "No quiero cortar… pero la vida me obliga…" },
  { nombre: "Lámpara Romántica", img: "./imagenes/lampara.png", humor: "Siempre ilumino tus momentos… incluso los que deberías apagar." },
  { nombre: "Plato Solitario", img: "./imagenes/plato.png", humor: "Siempre vacío… excepto cuando te veo." },
  { nombre: "Radio Nostálgico", img: "./imagenes/radio.png", humor: "Todo tiempo pasado sonaba mejor…" },
  { nombre: "Reloj Paranoico", img: "./imagenes/reloj.png", humor: "Tic… ¿escuchaste eso?… Tac…" },
  { nombre: "Rollo Justiciero", img: "./imagenes/rollo.png", humor: "Yo limpio el mundo… ¡uno por uno!" },
  { nombre: "Taza Sarcástica", img: "./imagenes/taza.png", humor: "Ah sí… café otra vez… wow." },
  { nombre: "Tostador Romántico", img: "./imagenes/tostador.png", humor: "Caliento pan… pero contigo caliento el corazón." }
];

const objetos = ref([...objetosData]);
const currentIndex = ref(0);
const currentObj = computed(() => objetos.value[currentIndex.value] ?? null);

const frasesMatch = {
  "Batidora Fiestera": "¡Batimos juntos con amor y diversión! 😄❤️",
  "Bota Perdida": "Finalmente encontré mis pasos perfectos contigo 👢💖",
  "Calcetín Perdido": "Eres la otra mitad que me hace completo 🧦🥰",
  "Control Remoto Perfeccionista": "Perdí el control… pero contigo es perfecto 😏❤️",
  "Cuchara Existencial": "Cada cucharada de vida es mejor a tu lado 🥄💫",
  "Espejo Vanidoso": "Reflejo de amor y ternura, solo para ti 😘✨",
  "Cuchillo Angustiado": "No quiero cortar… solo abrazarte ❤️🔪",
  "Lámpara Romántica": "Iluminas mis días y mis noches 💡💖",
  "Plato Solitario": "Siempre vacío… hasta que apareciste 🍽️❤️",
  "Radio Nostálgico": "Sintonizando solo por ti 📻💞",
  "Reloj Paranoico": "Cada segundo contigo es un tesoro ⏰❤️",
  "Rollo Justiciero": "Contigo limpio mi corazón de todo 💖🧻",
  "Taza Sarcástica": "Café y amor, ambos mejor contigo ☕❤️",
  "Tostador Romántico": "Caliento pan, caliento corazón… contigo 🍞💖"
};

const matchActual = ref(null);
const chatActivo = ref(null);
const mensajes = ref([]);
const entrada = ref("");

function like() {
  if (!currentObj.value) return;
  matchActual.value = { 
    nombre: currentObj.value.nombre, 
    frase: frasesMatch[currentObj.value.nombre] || "¡Coincidencia perfecta! 💞"
  };
  nextCard();
}

function reject() { nextCard(); }

function nextCard() {
  currentIndex.value++;
  if (currentIndex.value >= objetos.value.length) currentIndex.value = objetos.value.length;
}

function resetDeck() {
  objetos.value = [...objetosData];
  currentIndex.value = 0;
}

function abrirChat(obj) {
  chatActivo.value = obj;
  mensajes.value = [{ texto: "Hola!", tipo: "bot" }];
}

function cerrarChat() { chatActivo.value = null; }

function enviarMensaje() {
  if (!entrada.value) return;
  mensajes.value.push({ texto: entrada.value, tipo: "user" });
  mensajes.value.push({ texto: `¡Respuesta divertida de ${chatActivo.value.nombre}! 😄`, tipo: "bot" });
  entrada.value = "";
  nextTick(() => {
    const chat = refs.chatMessages;
    if (chat) chat.scrollTop = chat.scrollHeight;
  });
}

function closeMatch() { matchActual.value = null; }
</script>



<style>
body { margin:0; font-family: "Segoe UI", sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; background:#f3e7ff; }
.emoji-icon { font-size: 32px; display:flex; align-items:center; justify-content:center; }
.iphone-frame { width: 390px; height: 844px; background: #000; border-radius: 60px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5); overflow: hidden; }
.iphone-notch { position:absolute; top:12px; left:50%; transform:translateX(-50%); width:210px; height:30px; background:#000; border-radius:20px 20px 12px 12px; z-index:50; }

.lock-screen { width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:18px; background: linear-gradient(180deg,#f7e8ff,#ffdff7); color:#fff; text-align:center; }
.lock-time { font-size:4rem; color:#fff; text-shadow:0 6px 20px rgba(122,43,209,0.25); }
.lock-sub { color:#fff; opacity:0.9; font-size:0.9rem; }
.home-button { position: absolute; bottom: 48px; display:flex; justify-content:center; width:100%; pointer-events:auto; }
.home-circle { width:46px; height:46px; border-radius:50%; display:flex; justify-content:center; align-items:center; background: rgba(255,255,255,0.12); color:#fff; font-size:20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); cursor:pointer; transition: transform .18s ease; }
.home-circle:active { transform: scale(.95); }

.home-screen-ios { width:100%; height:100%; padding-top: 52px; display:flex; justify-content:center; align-items:flex-start; background:#8855ff; }
.ios-grid { display: grid; grid-template-columns: repeat(4, 72px); gap: 20px 18px; padding: 12px; }
.ios-icon { width:72px; text-align:center; cursor:pointer; color:#fff; }
.ios-icon-img { width:72px; height:72px; border-radius:18px; overflow:hidden; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.8); box-shadow: 0 6px 18px rgba(0,0,0,0.25); }
.ios-icon p { margin-top:6px; font-size:0.65rem; color:#fff; text-shadow:0 0 4px rgba(0,0,0,0.6); }

.app { background:#fff; height:100%; border-radius:40px; padding-bottom:40px; box-shadow: inset 0 0 40px #d396f5; overflow:hidden; }
.hero { background: linear-gradient(135deg,#9854f0,#ff77d4); padding:18px 12px; color:white; border-bottom-left-radius:30px; border-bottom-right-radius:30px; text-align:center; }
.hero h1 { margin:0; font-size:1.6rem; } .hero p{ margin:6px 0 0; font-size:0.85rem; opacity:0.95; }

.tinder-area { padding: 16px; display:flex; flex-direction:column; align-items:center; gap:12px; }
.card-stage { width:100%; display:flex; justify-content:center; align-items:center; min-height:420px; }

.card.tinder-card { width:92%; max-width:340px; background:#fff; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.12); overflow:hidden; display:flex; flex-direction:column; }
.img-card { width:100%; height:320px; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.img-card img { width:auto; max-width:100%; max-height:100%; object-fit:contain; display:block; }
.card-badges { position:absolute; top:12px; right:12px; display:flex; gap:8px; }
.badge { background: rgba(255,255,255,0.95); border:none; padding:8px; border-radius:12px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.08); }
.card-body { padding:12px 14px 18px; text-align:center; }
.card-body h2 { margin:6px 0 6px; color:#7a2bd1; font-size:1.15rem; text-shadow: 0 0 3px #f2d0ff; }
.humor { font-style:italic; color:#444; font-size:0.92rem; margin:0 0 6px; }

.controls { display:flex; gap:24px; margin-top:8px; }
.control { width:72px; height:72px; border-radius:50%; border:none; font-size:1.6rem; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.12); transition:transform .15s ease; }
.control:hover { transform: translateY(-6px); }
.reject { background:#fff; color:#ff3b30; border:2px solid #ffd6d6; }
.like { background:#fff; color:#ff2d55; border:2px solid #ffdcee; }

.match-popup { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#f9dcff; padding:20px; width:280px; border-radius:20px; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.18); z-index:60; }
.btn-close { margin-top:10px; background:#ad5fff; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; }

.chat-box { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 320px; background: #f7d0ff; border-radius: 20px; padding: 12px; box-shadow:0 8px 25px rgba(255,95,221,0.5); z-index:70; }
.chat-messages { max-height: 160px; overflow-y:auto; margin-bottom:8px; }
.user { text-align:right; background:#dcb1ff; margin:5px; padding:8px; border-radius:10px; }
.bot { text-align:left; background:#ffdffe; margin:5px; padding:8px; border-radius:10px; }
.chat-input { display:flex; gap:8px; }
.chat-input input { flex:1; padding:8px; border-radius:8px; border:1px solid #f0c4ff; }

.no-more { text-align:center; padding:40px; }
.no-more .btn-match { background:#8a37ff; color:#fff; border:none; padding:8px 14px; margin:4px; border-radius:12px; cursor:pointer; }
.no-more .volver { background:#ccc; color:#000; }
</style>
