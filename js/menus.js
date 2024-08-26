import { app } from "../../scripts/app.js";
import { $el } from "../../scripts/ui.js";
import { exampleBtn } from "./itemButton/btnExample.js";
import { apiKeyBtn } from "./itemButton/btnApiKey.js";
import { modelBtn } from "./itemButton/btnModel.js";
import { newsBtn } from "./itemButton/btnNews.js";
import { styleExample } from "./subassembly/styleExample.js";
import { styleMenus } from "./subassembly/styleMenus.js";
import { styleUploadFile } from "./subassembly/styleUploadFile.js";


class FloatingButton {
    constructor(show_cases) {
        this.show_cases = show_cases
        this.button = $el("div.comfy-floating-button", {
            parent: document.body,
            onmousedown: (e) => this.startDrag(e),
        }, [
            $el("h2.bizyair-logo", {}, ["BizyAir"]),
            $el("div.bizyair-menu", {}, [
                $el("div.bizyair-menu-item", {}, [
                    exampleBtn,
                    apiKeyBtn,
                    modelBtn,
                    newsBtn,
                ]),
            ]),
            $el('div.cmfy-floating-button-closer', { 
                onclick: () => this.toggleVisibility(event) 
            })
        ]);
        
        this.dragging = false;
        this.visible = true;

        document.addEventListener("mousemove", (e) => this.doDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

    }

    startDrag(e) {
        this.dragging = true;
        this.offsetX = e.clientX - this.button.offsetLeft;
        this.offsetY = e.clientY - this.button.offsetTop;
    }

    endDrag() {
        this.dragging = false;
    }

    doDrag(e) {
        if (this.dragging) {
            this.button.style.left = (e.clientX - this.offsetX) + 'px';
            this.button.style.top = (e.clientY - this.offsetY) + 'px';
            this.button.style.bottom = 'auto';
            this.button.style.right = 'auto';
        }
    }

    toggleVisibility(e) {
        e.stopPropagation();
        const bizyairMenu = document.querySelector('.bizyair-menu')
        const bizyairMenuCloser = document.querySelector('.cmfy-floating-button-closer')
        console.log(bizyairMenu)
        if (this.visible) {
            bizyairMenu.className = 'bizyair-menu bizyair-menu-hidden';
            bizyairMenuCloser.className = 'cmfy-floating-button-closer cmfy-floating-button-closer-overturn'
        } else {
            bizyairMenu.className = 'bizyair-menu';
            bizyairMenuCloser.className = 'cmfy-floating-button-closer'
        }
        this.visible = !this.visible;
    }
}

app.registerExtension({
    name: "comfy.FloatingButton",
    async setup() {
        $el("style", {
            textContent: styleMenus,
            parent: document.head,
        });
        $el("style", {
            textContent: styleExample,
            parent: document.head,
        });
        $el("style", {
            textContent: styleUploadFile,
            parent: document.head,
        });
        
        new FloatingButton();
    },
});