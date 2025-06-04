// ShoreSquad App JS
// Placeholder for interactive features

document.addEventListener('DOMContentLoaded', () => {
  // Example: Show a welcome message
  console.log('Welcome to ShoreSquad!');

  // TODO: Initialize map, fetch weather, load events
});

// Smooth scroll is now handled by scrollToSection in index.html

// Fun interactive feature: click counter
let funClicks = 0;
window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.fancy-header');
  if (header) {
    header.addEventListener('click', () => {
      funClicks++;
      if (funClicks % 5 === 0) {
        alert(`Wah, you clicked the header ${funClicks} times lah! 🌊`);
      }
    });
  }

  // Map update on 'View on Map' click
  document.querySelectorAll('.view-on-map').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.event-card');
      const lat = card.getAttribute('data-lat');
      const lng = card.getAttribute('data-lng');
      const loc = card.getAttribute('data-location');
      const mapDiv = document.getElementById('map');
      mapDiv.innerHTML = `<iframe title="Cleanup Location: ${loc}" width="100%" height="300" frameborder="0" style="border:0; border-radius:8px;" src="https://www.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed&markers=${lat},${lng}|label:N" allowfullscreen></iframe><p style="margin-top:0.5rem;"><strong>Next Cleanup:</strong> ${loc}</p>`;
      scrollToSection('map-section');
    });
  });

  // Team member keyboard accessibility
  document.querySelectorAll('.team-member').forEach(member => {
    member.setAttribute('tabindex', '0');
    member.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        member.classList.toggle('show-about');
      }
    });
  });

  // Join Us popup logic
  const joinBtn = document.getElementById('join-btn');
  const joinPopup = document.getElementById('join-popup');
  if (joinBtn && joinPopup) {
    joinBtn.addEventListener('click', () => {
      joinPopup.classList.add('active');
      joinPopup.querySelector('.close-btn').focus();
    });
    joinPopup.querySelector('.close-btn').addEventListener('click', closeJoinPopup);
    // ESC key closes popup
    document.addEventListener('keydown', function escHandler(e) {
      if (joinPopup.classList.contains('active') && e.key === 'Escape') {
        closeJoinPopup();
      }
    });
  }
});

function closeJoinPopup() {
  const joinPopup = document.getElementById('join-popup');
  if (joinPopup) joinPopup.classList.remove('active');
}
