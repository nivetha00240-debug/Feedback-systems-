let selectedRating = 0;
let allFeedbacks = [];

// Use Backend URL here - Local la run pannum pothu ithu
const API_URL = 'http://localhost:3000/api/feedbacks';

function setRating(n){
  selectedRating = n;
  let stars = document.querySelectorAll('#stars span');
  stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
  document.getElementById('ratingText').innerText = n + ' Star' + (n > 1 ? 's' : '') + ' - ' + ['','Very Bad','Bad','Good','Very Good','Excellent'][n];
}

async function submitFeedback(){
  let name = document.getElementById('name').value.trim();
  let email = document.getElementById('email').value.trim();
  let category = document.getElementById('category').value;
  let message = document.getElementById('message').value.trim();

  if(!name || !message || selectedRating === 0){
    alert('Please fill Name, Message and Rating!');
    return;
  }

  let data = { name, email, category, rating: selectedRating, message, date: new Date().toLocaleString('en-IN') };

  try{
    // Try Backend
    let res = await fetch(API_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Backend not running');
  } catch(e){
    // Fallback: If Backend not running, save in LocalStorage (for GitHub Pages demo)
    let local = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    local.unshift(data);
    localStorage.setItem('feedbacks', JSON.stringify(local));
  }

  document.getElementById('msg').innerText = 'Thank you ' + name + '! Feedback Submitted ❤️';
  document.getElementById('name').value='';
  document.getElementById('email').value='';
  document.getElementById('message').value='';
  setRating(0);
  document.getElementById('ratingText').innerText = 'Click a star to rate';
  loadFeedbacks();
}

async function loadFeedbacks(){
  try{
    let res = await fetch(API_URL);
    allFeedbacks = await res.json();
  } catch(e){
    allFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    // Default demo data
    if(allFeedbacks.length === 0){
      allFeedbacks = [
        {name:"Priya", category:"Product", rating:5, message:"Product quality super ah iruku! Delivery kooda fast.", date:"10 Nov 2026"},
        {name:"Arun", category:"Service", rating:4, message:"Service nalla iruku, konjam price kammi panna nalla irukum.", date:"10 Nov 2026"},
        {name:"Divya", category:"Website", rating:5, message:"Website use panna romba easy ah iruku.", date:"09 Nov 2026"}
      ];
    }
  }

  let filter = document.getElementById('filter').value;
  let list = filter === 'all' ? allFeedbacks : allFeedbacks.filter(f => f.rating == filter);

  document.getElementById('count').innerText = allFeedbacks.length;
  let avg = allFeedbacks.length ? (allFeedbacks.reduce((s,f)=>s+f.rating,0)/allFeedbacks.length).toFixed(1) : 0;
  document.getElementById('avg').innerText = avg;

  document.getElementById('feedbackList').innerHTML = list.map((f,i) => `
    <div class="feedback-card">
      <h3>${f.name} <span>${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</span></h3>
      <span class="cat">${f.category}</span>
      <button class="delete-btn" onclick="deleteFeedback(${i})">Delete</button>
      <p>${f.message}</p>
      <small>${f.date || ''}</small>
    </div>
  `).join('') || '<p style="margin-top:15px">No feedbacks yet.</p>';
}

async function deleteFeedback(index){
  if(!confirm('Delete this feedback?')) return;
  try{
    await fetch(API_URL + '/' + index, { method:'DELETE' });
  } catch(e){
    allFeedbacks.splice(index,1);
    localStorage.setItem('feedbacks', JSON.stringify(allFeedbacks));
  }
  loadFeedbacks();
}

loadFeedbacks();
