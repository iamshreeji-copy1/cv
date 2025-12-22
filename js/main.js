document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

async function loadComponents() {
    // 1. Inject Navbar and Footer
    try {
        const navReq = await fetch('components/navbar.html');
        const footerReq = await fetch('components/footer.html');
        
        if (navReq.ok) document.getElementById('nav-placeholder').innerHTML = await navReq.text();
        if (footerReq.ok) document.getElementById('footer-placeholder').innerHTML = await footerReq.text();
        
        initializeControls();
    } catch (error) {
        console.error("Error loading components:", error);
    }
}

function initializeControls() {
    // --- THEME TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // --- SMART FONT SIZE CONTROLS ---
    const html = document.documentElement;
    const btnSmall = document.getElementById('btn-font-small');
    const btnMedium = document.getElementById('btn-font-medium');
    const btnIncrease = document.getElementById('btn-font-increase');

    // Helper: Apply the size to CSS
    const applyFontSize = (sizeName) => {
        if (sizeName === 'small') html.style.fontSize = '85%';      // Small
        else if (sizeName === 'medium') html.style.fontSize = '100%'; // Normal
        else if (sizeName === 'large') html.style.fontSize = '120%';  // Big
        else if (sizeName === 'xlarge') html.style.fontSize = '145%'; // Very Big
        
        localStorage.setItem('fontSize', sizeName);
    };

    // 1. Load Saved Preference
    let currentSize = localStorage.getItem('fontSize') || 'medium';
    applyFontSize(currentSize);

    // 2. Button Logic
    
    // A- Button: Force Small
    if(btnSmall) {
        btnSmall.addEventListener('click', () => {
            currentSize = 'small';
            applyFontSize(currentSize);
        });
    }

    // A Button: Force Medium (Reset)
    if(btnMedium) {
        btnMedium.addEventListener('click', () => {
            currentSize = 'medium';
            applyFontSize(currentSize);
        });
    }

    // A+ Button: Smart Increase
    // Logic: If Small/Medium -> Go Large. If Large -> Go XLarge.
    if(btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            if (currentSize === 'small' || currentSize === 'medium') {
                currentSize = 'large'; // Step 1: Big
            } else if (currentSize === 'large') {
                currentSize = 'xlarge'; // Step 2: Very Big
            } 
            // If already xlarge, do nothing (stay max)
            
            applyFontSize(currentSize);
        });
    }


    // --- TEXT TO SPEECH (TTS) LOGIC ---
    const ttsBtn = document.getElementById('tts-toggle');
    let isSpeaking = false;
    let speech = new SpeechSynthesisUtterance();

    if(ttsBtn) {
        ttsBtn.addEventListener("click", () => {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                isSpeaking = false;
                ttsBtn.innerHTML = "🔊"; 
            } else {
                const content = document.querySelector("main") ? document.querySelector("main").innerText : document.body.innerText;
                speech.text = content;
                speech.rate = 1;
                speech.pitch = 1;
                window.speechSynthesis.speak(speech);
                isSpeaking = true;
                ttsBtn.innerHTML = "Cc"; 
            }
        });

        speech.onend = function() {
            isSpeaking = false;
            ttsBtn.innerHTML = "🔊";
        };
    }

    // --- GOOGLE TRANSLATE INIT ---
    if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
    }
}

// Callback for Google Translate
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,gu,zh-CN,es,ar,fr,ru,pt,de,ja,bn,mr,ta,te,ur,ko,it,tr,id', 
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}