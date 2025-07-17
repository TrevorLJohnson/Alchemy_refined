// frontend/main.js

// UI elements
const newChatBtn        = document.getElementById('new-conversation-btn');
const conversationTitle = document.getElementById('conversation-title');
const sendBtn           = document.getElementById('send-btn');
const chatInput         = document.getElementById('user-input');
const chatHistory       = document.getElementById('chat-history');
const categorySections  = document.getElementById('category-sections');
const pieCtx            = document.getElementById('pie-canvas').getContext('2d');

// Roman numerals helper
function toRoman(num) {
  const romans = [
    '', 'I','II','III','IV','V','VI','VII','VIII','IX','X',
    'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'
  ];
  return romans[num] || num;
}

// Typewriter effect for titles
async function typeText(el, text, delay = 50) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise((r) => setTimeout(r, delay));
  }
}

// Empty history storage
let historyEntries = [];

// Chart.js setup with percent labels & animated entry
Chart.register(ChartDataLabels);
const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#8884d8','#82ca9d','#ffc658','#0088FE','#FF8042',
        '#FFBB28','#00C49F','#A28EF4','#F47CA2','#FF6633'
      ]
    }]
  },
  options: {
    animation: {
      animateRotate: true,
      delay(ctx) {
        // Stagger slice entry by index
        return ctx.dataIndex * 300;
      }
    },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#fff' } },
      datalabels: {
        color: '#fff',
        formatter: (value, ctx) => {
          const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return sum ? `${Math.round((value / sum) * 100)}%` : '';
        }
      }
    }
  }
});

// New-chat handler: clear UI & reset state
newChatBtn.addEventListener('click', () => {
  historyEntries = [];
  chatHistory.innerHTML = '';
  categorySections.innerHTML = '';
  pieChart.data.labels = [];
  pieChart.data.datasets[0].data = [];
  pieChart.update();
  typeText(conversationTitle, 'New Conversation', 30);
});

// Main send/receive logic
async function sendPrompt() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Render user bubble
  const userBubble = document.createElement('div');
  Object.assign(userBubble.style, {
    alignSelf: 'flex-end',
    background: '#6B46C1',
    color: '#FFF',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    maxWidth: '60%'
  });
  userBubble.textContent = text;
  chatHistory.appendChild(userBubble);

  // API call
  let json;
  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    json = await res.json();
    if (!res.ok) throw new Error(json.error);
  } catch (err) {
    alert('Error: ' + err.message);
    return;
  }

  // Render assistant bubble
  const aiBubble = document.createElement('div');
  Object.assign(aiBubble.style, {
    alignSelf: 'flex-start',
    background: '#2D3748',
    color: '#FFF',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    maxWidth: '60%'
  });
  aiBubble.textContent = json.reply;
  chatHistory.appendChild(aiBubble);

  // Normalize categories
  const raw = Array.isArray(json.categories)
    ? json.categories
    : (json.categories?.current || []);
  const cats = raw.map((c) => (
    typeof c === 'string' ? { name: c, value: 1 } : { name: c.name, value: c.value }
  ));

  // Record in history
  historyEntries.unshift({ timestamp: json.timestamp, cats, aiBubble });

  // Generate conversation title on first message
  if (historyEntries.length === 1) {
    const combined = `${text}\n\n${json.reply}`;
    // AI‐driven title request
    try {
      const titleRes = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Give a concise title for this conversation:\n\n${combined}`
        })
      });
      const titleJson = await titleRes.json();
      if (titleRes.ok) await typeText(conversationTitle, titleJson.reply, 40);
    } catch {
      conversationTitle.textContent = 'Conversation';
    }
  }

  // Render historical category sections
  categorySections.innerHTML = '';
  historyEntries.forEach((entry, idx) => {
    const sec = document.createElement('div');
    sec.style.borderTop = idx > 0 ? '1px solid #4A5568' : 'none';
    sec.style.padding = '0.5rem 0';
    sec.style.cursor = 'pointer';

    const hdr = document.createElement('h4');
    hdr.textContent = `${toRoman(idx+1)}. ${entry.timestamp}`;
    hdr.style.color = '#9F7AEA';
    sec.appendChild(hdr);

    const ul = document.createElement('ul');
    ul.style.listStyle = 'disc';
    ul.style.paddingLeft = '1.5rem';
    ul.style.color = '#E2E8F0';
    entry.cats.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c.name;
      ul.appendChild(li);
    });
    sec.appendChild(ul);

    sec.addEventListener('click', () => {
      // Update pie chart
      pieChart.data.labels = entry.cats.map((c) => c.name);
      pieChart.data.datasets[0].data = entry.cats.map((c) => c.value);
      pieChart.update();
      // Scroll chat into view
      entry.aiBubble.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    categorySections.appendChild(sec);
  });

  // Animate pie chart update
  pieChart.data.labels = cats.map((c) => c.name);
  pieChart.data.datasets[0].data = cats.map((c) => c.value);
  pieChart.update();

  // Clear input
  chatInput.value = '';
}

// Wire interactions
sendBtn.addEventListener('click', sendPrompt);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendPrompt();
  }
});
