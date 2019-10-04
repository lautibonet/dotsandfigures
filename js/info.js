export class AppInfo {
    constructor() {
        this.rootElement = document.getElementById("app-info");
        this.closePanel = document.getElementById("close-app-info");
        this.open = false;

        this.rootElement.style.transform = 'translateX(-' + this.rootElement.offsetWidth + 'px)';
    }

    toggleAppInfo() {
        if (this.open) {
            this.rootElement.style.transform = 'translateX(-' + this.rootElement.offsetWidth + 'px)';
        } else {
            this.rootElement.style.transform = 'translateX(0)';
        }
        this.open = !this.open;
    }

    updateResize() {
        this.rootElement.style.transform = 'translateX(-' + this.rootElement.offsetWidth + 'px)';
    }
}