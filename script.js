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
const mainPagePanels = Array.from(document.querySelectorAll(".mainpage-copy__panel"));
const posterStage = document.getElementById("poster-stage");
const posterStageImages = posterStage
    ? Array.from(posterStage.querySelectorAll(".poster-stage__image"))
    : [];

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
        ".mainpage-copy__headline, .mainpage-copy__body p, .folio-footer__column p"
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

if (posterStage && posterStageImages.length > 0) {
    const posterCount = Number.parseInt(posterStage.dataset.posterCount ?? "0", 10);
    let activePosterIndex = 1;

    const setPosterFrame = (frameIndex) => {
        const safeFrame = Math.min(Math.max(frameIndex, 1), posterCount);

        if (activePosterIndex === safeFrame) {
            return;
        }

        posterStageImages.forEach((image) => {
            image.classList.toggle(
                "is-active",
                image.dataset.posterIndex === String(safeFrame)
            );
        });

        activePosterIndex = safeFrame;
    };

    const updatePosterFromPointer = (clientX) => {
        const rect = posterStage.getBoundingClientRect();
        const clampedX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const progress = rect.width > 0 ? clampedX / rect.width : 0;
        const frameIndex = Math.min(
            posterCount,
            Math.floor(progress * posterCount) + 1
        );

        setPosterFrame(frameIndex);
    };

    posterStage.addEventListener("mouseenter", (event) => {
        updatePosterFromPointer(event.clientX);
    });

    posterStage.addEventListener("mousemove", (event) => {
        updatePosterFromPointer(event.clientX);
    });

    posterStage.addEventListener("mouseleave", () => {
        setPosterFrame(1);
    });
}

if (document.body.classList.contains("main-page") && mainPagePanels.length > 0) {
    let activePanelIndex = 0;
    let isPanelScrollLocked = false;

    const getClosestPanelIndex = () => {
        const viewportCenter = window.scrollY + (window.innerHeight / 2);
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        mainPagePanels.forEach((panel, index) => {
            const panelCenter = panel.offsetTop + (panel.offsetHeight / 2);
            const distance = Math.abs(panelCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    };

    const scrollToPanel = (index) => {
        const safeIndex = Math.min(Math.max(index, 0), mainPagePanels.length - 1);
        const targetPanel = mainPagePanels[safeIndex];

        activePanelIndex = safeIndex;
        isPanelScrollLocked = true;

        window.scrollTo({
            top: targetPanel.offsetTop,
            behavior: "smooth"
        });

        window.setTimeout(() => {
            isPanelScrollLocked = false;
        }, 700);
    };

    activePanelIndex = getClosestPanelIndex();

    window.addEventListener("wheel", (event) => {
        if (isPanelScrollLocked || Math.abs(event.deltaY) < 10) {
            return;
        }

        event.preventDefault();
        activePanelIndex = getClosestPanelIndex();

        if (event.deltaY > 0) {
            scrollToPanel(activePanelIndex + 1);
            return;
        }

        scrollToPanel(activePanelIndex - 1);
    }, { passive: false });

    window.addEventListener("keydown", (event) => {
        if (isPanelScrollLocked) {
            return;
        }

        const moveForwardKeys = ["PageDown", "ArrowDown", " "];
        const moveBackwardKeys = ["PageUp", "ArrowUp"];

        if (!moveForwardKeys.includes(event.key) && !moveBackwardKeys.includes(event.key)) {
            return;
        }

        event.preventDefault();
        activePanelIndex = getClosestPanelIndex();

        if (moveForwardKeys.includes(event.key)) {
            scrollToPanel(activePanelIndex + 1);
            return;
        }

        scrollToPanel(activePanelIndex - 1);
    });

    window.addEventListener("scroll", () => {
        if (isPanelScrollLocked) {
            return;
        }

        activePanelIndex = getClosestPanelIndex();
    }, { passive: true });
}
