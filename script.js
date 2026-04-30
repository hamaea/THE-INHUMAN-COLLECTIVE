const landingForm = document.getElementById("landing-form");
const passwordInput = document.getElementById("password-input");
const landingPrompt = document.getElementById("landing-prompt");

if (landingForm && passwordInput) {
    const expectedPassword = "MANMADE";
    const activateLanding = () => {
        document.body.classList.add("is-activated");
        passwordInput.tabIndex = 0;
        window.setTimeout(() => {
            passwordInput.focus();
        }, 220);
    };

    if (landingPrompt) {
        landingPrompt.addEventListener("click", activateLanding);
    }

    passwordInput.addEventListener("input", () => {
        const selectionStart = passwordInput.selectionStart;
        const selectionEnd = passwordInput.selectionEnd;

        passwordInput.value = passwordInput.value.toUpperCase();
        passwordInput.classList.remove("is-error");

        if (selectionStart !== null && selectionEnd !== null) {
            passwordInput.setSelectionRange(selectionStart, selectionEnd);
        }
    });

    landingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (passwordInput.value === expectedPassword) {
            window.location.href = "mainpage.html";
            return;
        }

        passwordInput.classList.add("is-error");
    });
}

const gradientPanel = document.getElementById("gradient-panel");
const scrollWord = document.getElementById("scroll-word");
const copyHighlightContainer = document.querySelector(".mainpage-copy");

if (gradientPanel) {
    const gradientColors = [
        "#5EFF4C",
        "#EE27B9",
        "#0215E4",
        "#F9FF49",
        "#FB8749",
        "#FF2B2B",
        "#8D1CFF"
    ];
    const randomColor = gradientColors[Math.floor(Math.random() * gradientColors.length)];

    gradientPanel.style.setProperty("--main-gradient-color", randomColor);
    document.documentElement.style.setProperty("--main-gradient-color", randomColor);
}

if (copyHighlightContainer) {
    const highlightTargets = copyHighlightContainer.querySelectorAll(
        ".mainpage-copy__headline, .mainpage-copy__body p"
    );

    highlightTargets.forEach((target) => {
        target.setAttribute("data-text", target.innerText ?? "");
    });

    const hideCursorHighlight = () => {
        highlightTargets.forEach((target) => {
            target.style.setProperty("--copy-cursor-x", "-100px");
            target.style.setProperty("--copy-cursor-y", "-100px");
        });
    };

    copyHighlightContainer.addEventListener("mousemove", (event) => {
        highlightTargets.forEach((target) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            target.style.setProperty("--copy-cursor-x", `${x}px`);
            target.style.setProperty("--copy-cursor-y", `${y}px`);
        });
    });

    copyHighlightContainer.addEventListener("mouseleave", hideCursorHighlight);
    hideCursorHighlight();
}

if (scrollWord) {
    const scrollWords = [
        "assets/1. MANMADE.png",
        "assets/2. ALWAYS.png",
        "assets/3. DELICATE.png",
        "assets/4. FINISHED.png",
        "assets/5. FOREVER.png",
        "assets/6. INFINITE.png",
        "assets/7. ORIGINAL.png",
        "assets/8. PERFECT.png",
        "assets/9. TIMELESS.png",
        "assets/10. UNEVEN.png",
        "assets/11. UNKEMPT.png"
    ];

    const updateScrollWord = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight <= 0) {
            scrollWord.src = scrollWords[0];
            scrollWord.dataset.wordIndex = "1";
            return;
        }

        const scrollTop = window.scrollY;
        const progress = scrollTop / scrollableHeight;
        const isAtBottom = scrollTop >= scrollableHeight - 2;

        if (isAtBottom) {
            scrollWord.src = scrollWords[0];
            scrollWord.dataset.wordIndex = "1";
            return;
        }

        const steppedProgress = Math.min(progress / 0.985, 0.999999);
        const wordIndex = Math.min(
            scrollWords.length - 1,
            Math.floor(steppedProgress * scrollWords.length)
        );
        const assetPath = scrollWords[wordIndex];
        const nextIndex = String(wordIndex + 1);

        if (scrollWord.dataset.wordIndex !== nextIndex) {
            scrollWord.src = assetPath;
            scrollWord.dataset.wordIndex = nextIndex;
        }
    };

    updateScrollWord();
    window.addEventListener("scroll", updateScrollWord, { passive: true });
    window.addEventListener("resize", updateScrollWord);
}
