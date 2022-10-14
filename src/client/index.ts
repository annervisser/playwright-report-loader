const loadButton = document.querySelector<HTMLButtonElement>('#load');
const urlInput = document.querySelector<HTMLInputElement>('#zipUrl');
const fileInput = document.querySelector<HTMLInputElement>('#zipFile');
loadButton.disabled = true;


document.addEventListener('DOMContentLoaded', () => {
    if (!urlInput.value) {
        urlInput.value = document.location.href + 'playwright-html.zip';
    }
})

const workerURL = './worker.js';
navigator.serviceWorker.register(workerURL)
    .then(() => console.log('Installing...'))
    .catch(error => console.log('Error while installing service worker:', error));


navigator.serviceWorker.ready.then(() => {
    let broadcast: BroadcastChannel;

    loadButton.onclick = () => {
        let url: string;
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            url = URL.createObjectURL(file);
        } else {
            url = urlInput.value;
        }

        if (!url) {
            throw new Error('No url or file provided');
        }
        console.log('url: ', url);
        
        const id = crypto.randomUUID();
        broadcast?.close();
        broadcast = new BroadcastChannel(id);
        broadcast.onmessage = async (message) => {
            switch (message.data.type) {
                case 'LOADED':
                    console.log('got message: LOADED');
                    const response = await fetch(`/${id}/data/b41a6b6af21edf559e0f5a473b5ca6f5447b1d7e.zip`);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    console.log('Link to zip:', url)

                    document.location.href = `./${id}/`;
                    // const iframe = document.createElement('iframe');
                    // iframe.src = `/${id}/`;
                    // let iframeContainer = document.querySelector('#iframe-container');
                    // iframeContainer.innerHTML = '';
                    // iframeContainer.appendChild(iframe);
            }
        }

        navigator.serviceWorker.controller.postMessage({
            type: 'LOAD',
            id: id,
            url: url,
        });
    };
    loadButton.disabled = false;
});
