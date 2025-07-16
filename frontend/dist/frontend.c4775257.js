// frontend/main.js
// UI elements
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');
const categorySections = document.getElementById('category-sections');
const pieCanvasCtx = document.getElementById('pie-canvas').getContext('2d');
// Roman numerals for label
function toRoman(num) {
    const romans = [
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
        'XIII',
        'XIV',
        'XV',
        'XVI',
        'XVII',
        'XVIII',
        'XIX',
        'XX'
    ];
    return romans[num] || num;
}
// Color palette for pie slices
const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#0088FE',
    '#FF8042',
    '#FFBB28',
    '#00C49F',
    '#A28EF4',
    '#F47CA2',
    '#FF6633'
];
// Initialize empty pie chart
const pieChart = new Chart(pieCanvasCtx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: COLORS
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});
// In-memory history
const historyEntries = [];
// Main send handler
async function sendPrompt() {
    const text = chatInput.value.trim();
    if (!text) return;
    // 1) Render user bubble
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'flex-start';
    const userDiv = document.createElement('div');
    userDiv.textContent = text;
    Object.assign(userDiv.style, {
        alignSelf: 'flex-end',
        background: '#6B46C1',
        color: '#FFF',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        maxWidth: '60%',
        margin: '0.25rem 0'
    });
    wrapper.appendChild(userDiv);
    // 2) Call API
    let json;
    try {
        const res = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text
            })
        });
        json = await res.json();
        if (!res.ok) {
            alert('Server error: ' + json.error);
            return;
        }
    } catch (err) {
        alert('Network error: ' + err.message);
        return;
    }
    // 3) Render assistant bubble
    const replyDiv = document.createElement('div');
    replyDiv.textContent = json.reply;
    Object.assign(replyDiv.style, {
        alignSelf: 'flex-start',
        background: '#2D3748',
        color: '#FFF',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        maxWidth: '60%',
        margin: '0.25rem 0'
    });
    wrapper.appendChild(replyDiv);
    chatHistory.appendChild(wrapper);
    // 4) Normalize categories
    const rawCats = Array.isArray(json.categories) ? json.categories : json.categories?.current || [];
    const cats = rawCats.map((c)=>typeof c === 'string' ? {
            name: c,
            value: 1
        } : {
            name: c.name,
            value: c.value
        });
    // 5) Record in history
    historyEntries.unshift({
        timestamp: json.timestamp,
        cats,
        wrapper
    });
    // 6) Re-render category sections
    categorySections.innerHTML = '';
    historyEntries.forEach((entry, idx)=>{
        const section = document.createElement('div');
        section.style.cursor = 'pointer';
        section.style.padding = '0.5rem 0';
        section.style.borderTop = idx > 0 ? '1px solid #4A5568' : 'none';
        const header = document.createElement('h3');
        header.textContent = `${toRoman(idx + 1)}. ${entry.timestamp}`;
        header.style.color = '#9F7AEA';
        header.style.margin = '0';
        section.appendChild(header);
        const ul = document.createElement('ul');
        ul.style.listStyle = 'disc';
        ul.style.paddingLeft = '1.5rem';
        ul.style.color = '#E2E8F0';
        entry.cats.forEach((cat)=>{
            const li = document.createElement('li');
            li.textContent = cat.name;
            ul.appendChild(li);
        });
        section.appendChild(ul);
        section.addEventListener('click', ()=>{
            // Update pie to that entry
            pieChart.data.labels = entry.cats.map((c)=>c.name);
            pieChart.data.datasets[0].data = entry.cats.map((c)=>c.value);
            pieChart.update();
            // Scroll chat to that conversation
            entry.wrapper.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        categorySections.appendChild(section);
    });
    // 7) Update pie to current
    pieChart.data.labels = cats.map((c)=>c.name);
    pieChart.data.datasets[0].data = cats.map((c)=>c.value);
    pieChart.update();
    // 8) Clear input
    chatInput.value = '';
}
// Wire interactions
sendBtn.addEventListener('click', sendPrompt);
chatInput.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') {
        e.preventDefault();
        sendPrompt();
    }
});

//# sourceMappingURL=frontend.c4775257.js.map
