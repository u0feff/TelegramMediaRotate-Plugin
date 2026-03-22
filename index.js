(function() {
    'use strict';

    function createButton() {
        const button = document.createElement("button");
        button.classList.add("btn-icon");
        button.id = "rotate-button";
        button.title = "Rotate Media";
        button.innerHTML = `
            <span class="tgico button-icon" style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="11.98 0.62 190.05 213.4" style="width: 20px; height: 20px;">
                   <path fill="currentColor" d="M202 95c0 47-33 85-77 94v25l-69-40 69-40v24a65 65 0 1 0-77-35l-27 13a95 95 0 1 1 181-40z"/>
                </svg>
            </span>
        `;

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const aspecter = document.querySelector(".media-viewer-aspecter");
            if (!aspecter) return;

           
            aspecter.style.setProperty("overflow", "visible", "important");
            const mover = document.querySelector(".media-viewer-mover");
            if (mover) mover.style.setProperty("overflow", "visible", "important");

           
            const visualElements = aspecter.querySelectorAll("img, video, canvas");
            if (visualElements.length === 0) return;

        
            let currentRotation = parseInt(aspecter.dataset.rotation) || 0;
            currentRotation += 90;
            aspecter.dataset.rotation = currentRotation;

            let scale = 1;

           
            if (currentRotation % 180 !== 0) {
                
                let baseW = aspecter.offsetWidth;
                let baseH = aspecter.offsetHeight;

                
                let rotatedW = baseH;
                let rotatedH = baseW;

             
                let maxW = window.innerWidth * 0.90;
                let maxH = window.innerHeight * 0.73;

                // Если повернутое видео/фото больше, чем доступное место на экране — уменьшаем его
                if (rotatedW > maxW || rotatedH > maxH) {
                    scale = Math.min(maxW / rotatedW, maxH / rotatedH);
                }
            }

            
            visualElements.forEach(el => {
                el.style.transform = `rotate(${currentRotation}deg) scale(${scale})`;
                el.style.transition = "transform 0.3s ease";
            });
        });
        return button;
    }

    function addButtonToMediaViewerButtons() {
        const mediaViewerButtons = document.querySelector(".media-viewer-buttons");
        if (mediaViewerButtons && !document.querySelector("#rotate-button")) {
            const buttons = mediaViewerButtons.querySelectorAll(".btn-icon");
            if (buttons.length >= 3) {
                buttons[2].after(createButton());
            } else if (buttons.length > 0) {
                buttons[buttons.length - 1].after(createButton());
            }
        }

        const aspecter = document.querySelector(".media-viewer-aspecter");
        if (aspecter && aspecter.style.overflow !== "visible") {
            aspecter.style.setProperty("overflow", "visible", "important");
        }
    }

    GM_addStyle(`
        .page-chats {
            display: flex;
            max-width: none !important;
        }
    `);

    const observer = new MutationObserver(() => {
        addButtonToMediaViewerButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addButtonToMediaViewerButtons();

})();
