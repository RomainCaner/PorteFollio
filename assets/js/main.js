/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/*===== MODAL FUNCTIONS =====*/
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        // Réactiver le défilement du body
        document.body.style.overflow = 'auto';
    }
}

// Fermer les modales en cliquant en dehors
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Fermer les modales avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show, .zoom-modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});

/*===== ZOOM FUNCTIONS =====*/
let currentZoom = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function openZoom(imgSrc, caption) {
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImg = document.getElementById('zoom-img');
    const zoomCaption = document.getElementById('zoom-caption');
    const zoomLevel = document.querySelector('.zoom-level');
    
    if (zoomModal && zoomImg && zoomCaption) {
        // Réinitialiser le zoom
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
        zoomLevel.textContent = '100%';
        
        zoomImg.src = imgSrc;
        zoomCaption.textContent = caption;
        zoomModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Ajouter les événements de zoom et de déplacement
        setupZoomEvents();
    }
}

function setupZoomEvents() {
    const zoomImg = document.getElementById('zoom-img');
    const zoomModal = document.getElementById('zoom-modal');
    
    // Zoom avec la molette de la souris
    zoomModal.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newZoom = Math.max(1, Math.min(5, currentZoom + delta));
        
        if (newZoom !== currentZoom) {
            // Calculer le point de zoom relatif à l'image
            const rect = zoomImg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Appliquer le zoom
            zoomTo(newZoom, x, y);
        }
    });
    
    // Gestion du déplacement de l'image
    zoomImg.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDragging);
    
    // Gestion tactile
    zoomImg.addEventListener('touchstart', handleTouchStart);
    zoomImg.addEventListener('touchmove', handleTouchMove);
    zoomImg.addEventListener('touchend', handleTouchEnd);
}

function zoomTo(newZoom, x, y) {
    const zoomImg = document.getElementById('zoom-img');
    const zoomLevel = document.querySelector('.zoom-level');
    
    // Mettre à jour le niveau de zoom
    currentZoom = newZoom;
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    
    // Ajouter/Retirer la classe zoomed
    if (currentZoom > 1) {
        zoomImg.classList.add('zoomed');
    } else {
        zoomImg.classList.remove('zoomed');
    }
    
    updateImageTransform();
}

function zoomIn() {
    const newZoom = Math.min(5, currentZoom + 0.5);
    zoomTo(newZoom);
}

function zoomOut() {
    const newZoom = Math.max(1, currentZoom - 0.5);
    zoomTo(newZoom);
}

function startDragging(e) {
    if (currentZoom > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    }
}

function drag(e) {
    if (isDragging && currentZoom > 1) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
        e.preventDefault();
    }
}

function stopDragging() {
    isDragging = false;
}

function updateImageTransform() {
    const zoomImg = document.getElementById('zoom-img');
    zoomImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// Gestion tactile
let touchStartX, touchStartY;

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartX = touch.clientX - translateX;
        touchStartY = touch.clientY - translateY;
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1 && currentZoom > 1) {
        const touch = e.touches[0];
        translateX = touch.clientX - touchStartX;
        translateY = touch.clientY - touchStartY;
        updateImageTransform();
        e.preventDefault();
    }
}

function handleTouchEnd() {
    touchStartX = null;
    touchStartY = null;
}

// Fermer le zoom en cliquant sur le bouton ou en dehors
document.addEventListener('DOMContentLoaded', () => {
    const zoomModal = document.getElementById('zoom-modal');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (zoomModal && zoomClose) {
        // Gestion des boutons de zoom
        zoomInBtn.addEventListener('click', () => {
            const newZoom = Math.min(5, currentZoom + 0.5);
            zoomTo(newZoom);
        });

        zoomOutBtn.addEventListener('click', () => {
            const newZoom = Math.max(1, currentZoom - 0.5);
            zoomTo(newZoom);
        });

        // Fermeture de la modale
        zoomClose.addEventListener('click', () => {
            zoomModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            resetZoom();
        });

        zoomModal.addEventListener('click', (e) => {
            if (e.target === zoomModal) {
                zoomModal.classList.remove('show');
                document.body.style.overflow = 'auto';
                resetZoom();
            }
        });
    }
});

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
    const zoomLevel = document.querySelector('.zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = '100%';
    }
    const zoomImg = document.getElementById('zoom-img');
    if (zoomImg) {
        zoomImg.classList.remove('zoomed');
    }
}

