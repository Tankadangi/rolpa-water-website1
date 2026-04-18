const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
let currentLang = localStorage.getItem('rolpaLang') || 'en';
let siteData = null;
let siteSettings = null;
async function loadCMSData() {
    try {
        if (window.SITE_DATA && window.SITE_SETTINGS) {
            siteData = window.SITE_DATA;
            siteSettings = window.SITE_SETTINGS;
        } else {
            const [langRes, setRes] = await Promise.all([fetch('data.json'), fetch('settings.json')]);
            siteData = await langRes.json();
            siteSettings = await setRes.json();
        }
        document.querySelectorAll('.logo').forEach(el => el.textContent = siteSettings.brand.company_name);
        const teamContainer = document.getElementById('team-container');
        if (teamContainer && siteSettings.team) {
            teamContainer.innerHTML = '';
            siteSettings.team.forEach((member, index) => {
                const memberCard = document.createElement('div');
                memberCard.className = 'team-member scroll-animate';
                memberCard.innerHTML = `<div class="team-quote-box"><div class="quote-icon">"</div><p class="team-quote">${member.quote}</p><div class="team-info"><h4>${member.name}</h4><span class="team-role">${member.role}</span></div></div><div class="team-photo-wrapper"><img src="${member.photo}" class="team-photo"></div>`;
                teamContainer.appendChild(memberCard);
                observer.observe(memberCard);
            });
        }
        setLanguage(currentLang);
    } catch (e) { console.error(e); }
}
function setLanguage(lang) {
    if (!siteData) return;
    currentLang = lang;
    localStorage.setItem('rolpaLang', lang);
    const trans = siteData.translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (trans[key]) el.innerHTML = trans[key];
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', (e) => setLanguage(e.target.getAttribute('data-lang'))));
    loadCMSData();
});