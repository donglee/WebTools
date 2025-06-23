class SpriteAtlasTool {
    constructor() {
        this.selectedFiles = [];
        this.atlasData = null;
        this.splitSprites = [];
        this.currentLanguage = 'zh';
        this.translations = {
            zh: {
                title: '🎮 精灵图集工具',
                subtitle: '支持n×n正方形图集的打包和分割',
                tab_pack: '📦 图片打包',
                tab_split: '✂️ 图集分割',
                drag_images: '拖拽图片文件到此处或点击选择',
                select_images: '选择图片',
                pack_settings: '打包设置',
                atlas_size: '图集大小:',
                grid_size: '网格大小 (n×n):',
                center_sprites: '子图居中:',
                padding: '间距:',
                generate_atlas: '生成图集',
                preview: '预览',
                download_atlas: '下载图集',
                download_config: '下载配置文件',
                drag_atlas: '拖拽图集文件到此处或点击选择',
                select_atlas: '选择图集',
                split_settings: '分割设置',
                split_atlas: '分割图集',
                split_preview: '分割预览',
                download_sprites: '下载所有精灵',
                selected_images: '已选择的图片'
            },
            en: {
                title: '🎮 Sprite Atlas Tool',
                subtitle: 'Pack and split n×n square sprite atlases',
                tab_pack: '📦 Pack Images',
                tab_split: '✂️ Split Atlas',
                drag_images: 'Drag image files here or click to select',
                select_images: 'Select Images',
                pack_settings: 'Pack Settings',
                atlas_size: 'Atlas Size:',
                grid_size: 'Grid Size (n×n):',
                center_sprites: 'Center Sprites:',
                padding: 'Padding:',
                generate_atlas: 'Generate Atlas',
                preview: 'Preview',
                download_atlas: 'Download Atlas',
                download_config: 'Download Config',
                drag_atlas: 'Drag atlas file here or click to select',
                select_atlas: 'Select Atlas',
                split_settings: 'Split Settings',
                split_atlas: 'Split Atlas',
                split_preview: 'Split Preview',
                download_sprites: 'Download All Sprites',
                selected_images: 'Selected Images'
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.switchTab('pack'); // 默认显示打包工具
        this.updateTexts(); // 初始化文本
    }

    setupEventListeners() {
        // 语言切换
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 文件选择
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        document.getElementById('split-file-input').addEventListener('change', (e) => {
            this.handleSplitFile(e.target.files[0]);
        });

        // 打包按钮
        document.getElementById('pack-btn').addEventListener('click', () => {
            this.packSprites();
        });

        // 分割按钮
        document.getElementById('split-btn').addEventListener('click', () => {
            this.splitAtlas();
        });

        // 下载按钮
        document.getElementById('download-atlas').addEventListener('click', () => {
            this.downloadAtlas();
        });

        document.getElementById('download-json').addEventListener('click', () => {
            this.downloadJSON();
        });

        document.getElementById('download-sprites').addEventListener('click', () => {
            this.downloadSprites();
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        const splitUploadArea = document.getElementById('split-upload-area');

        [uploadArea, splitUploadArea].forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                
                if (area === uploadArea) {
                    this.handleFiles(e.dataTransfer.files);
                } else {
                    this.handleSplitFile(e.dataTransfer.files[0]);
                }
            });
        });
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // 更新语言按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // 更新页面文本
        this.updateTexts();
    }

    updateTexts() {
        const texts = this.translations[this.currentLanguage];
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (texts[key]) {
                element.textContent = texts[key];
            }
        });
    }

    switchTab(tab) {
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // 显示对应面板
        document.querySelectorAll('.tool-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tab}-tool`).classList.add('active');
    }

    handleFiles(files) {
        const validFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/')
        );

        this.selectedFiles = [...this.selectedFiles, ...validFiles];
        this.updateImageList();
        this.updatePackButton();
    }

    handleSplitFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.splitImage = img;
                this.showSplitImagePreview(e.target.result, file.name);
                document.getElementById('split-btn').disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    showSplitImagePreview(imageSrc, fileName) {
        // 创建或更新图片预览区域
        let previewSection = document.getElementById('split-image-preview');
        if (!previewSection) {
            previewSection = document.createElement('div');
            previewSection.id = 'split-image-preview';
            previewSection.className = 'preview-section';
            
            const settingsSection = document.querySelector('#split-tool .settings-section');
            settingsSection.insertAdjacentElement('afterend', previewSection);
        }

        previewSection.innerHTML = `
            <h3>选择的图集</h3>
            <div class="preview-container">
                <div class="split-image-info">
                    <img src="${imageSrc}" alt="${fileName}" id="split-preview-img">
                    <div class="image-info">
                        <p><strong>文件名:</strong> ${fileName}</p>
                        <p><strong>尺寸:</strong> <span id="image-dimensions">加载中...</span></p>
                    </div>
                </div>
            </div>
        `;

        previewSection.style.display = 'block';

        // 获取图片尺寸信息
        const previewImg = document.getElementById('split-preview-img');
        previewImg.onload = () => {
            const dimensions = document.getElementById('image-dimensions');
            dimensions.textContent = `${previewImg.naturalWidth} × ${previewImg.naturalHeight} 像素`;
        };
    }

    updateImageList() {
        const imageList = document.getElementById('image-list');
        const imageGrid = document.getElementById('image-grid');

        if (this.selectedFiles.length === 0) {
            imageList.style.display = 'none';
            return;
        }

        imageList.style.display = 'block';
        imageGrid.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;

            const filename = document.createElement('div');
            filename.className = 'filename';
            filename.textContent = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => this.removeFile(index);

            item.appendChild(removeBtn);
            item.appendChild(img);
            item.appendChild(filename);
            imageGrid.appendChild(item);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateImageList();
        this.updatePackButton();
    }

    updatePackButton() {
        const packBtn = document.getElementById('pack-btn');
        packBtn.disabled = this.selectedFiles.length === 0;
    }

    async packSprites() {
        const gridSize = parseInt(document.getElementById('grid-size').value);
        const atlasSize = parseInt(document.getElementById('atlas-size').value);
        const padding = parseInt(document.getElementById('padding').value);
        const centerSprites = document.getElementById('center-sprites').checked;

        const maxSprites = gridSize * gridSize;
        if (this.selectedFiles.length > maxSprites) {
            const message = this.currentLanguage === 'zh' 
                ? `当前网格大小 ${gridSize}×${gridSize} 最多支持 ${maxSprites} 个精灵，请减少图片数量或增加网格大小。`
                : `Current grid size ${gridSize}×${gridSize} supports maximum ${maxSprites} sprites. Please reduce image count or increase grid size.`;
            alert(message);
            return;
        }

        const canvas = document.getElementById('pack-canvas');
        const ctx = canvas.getContext('2d');

        // 固定图集大小
        canvas.width = atlasSize;
        canvas.height = atlasSize;

        // 清空画布，保持透明背景
        ctx.clearRect(0, 0, atlasSize, atlasSize);

        // 计算每个网格的大小（边缘间距为一半）
        const edgePadding = padding / 2;
        const cellSize = Math.floor((atlasSize - 2 * edgePadding - (gridSize - 1) * padding) / gridSize);

        const sprites = [];
        const loadPromises = [];

        this.selectedFiles.forEach((file, index) => {
            const promise = new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const row = Math.floor(index / gridSize);
                    const col = index % gridSize;
                    const cellX = edgePadding + col * (cellSize + padding);
                    const cellY = edgePadding + row * (cellSize + padding);

                    let drawX = cellX;
                    let drawY = cellY;
                    let drawWidth = cellSize;
                    let drawHeight = cellSize;

                    if (centerSprites) {
                        // 计算图片的缩放比例，保持宽高比
                        const scale = Math.min(cellSize / img.width, cellSize / img.height);
                        drawWidth = img.width * scale;
                        drawHeight = img.height * scale;
                        
                        // 居中对齐
                        drawX = cellX + (cellSize - drawWidth) / 2;
                        drawY = cellY + (cellSize - drawHeight) / 2;
                    }

                    // 绘制图片到画布
                    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

                    sprites.push({
                        name: file.name.split('.')[0],
                        x: Math.round(drawX),
                        y: Math.round(drawY),
                        width: Math.round(drawWidth),
                        height: Math.round(drawHeight),
                        index: index
                    });

                    resolve();
                };
                img.src = URL.createObjectURL(file);
            });
            loadPromises.push(promise);
        });

        await Promise.all(loadPromises);

        this.atlasData = {
            meta: {
                image: 'atlas.png',
                size: { w: atlasSize, h: atlasSize },
                scale: 1,
                format: 'RGBA8888'
            },
            frames: sprites.reduce((acc, sprite) => {
                acc[sprite.name] = {
                    frame: { x: sprite.x, y: sprite.y, w: sprite.width, h: sprite.height },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: { x: 0, y: 0, w: sprite.width, h: sprite.height },
                    sourceSize: { w: sprite.width, h: sprite.height }
                };
                return acc;
            }, {})
        };

        document.getElementById('pack-preview').style.display = 'block';
    }

    splitAtlas() {
        const gridSize = parseInt(document.getElementById('split-grid-size').value);
        const padding = parseInt(document.getElementById('split-padding').value);

        if (!this.splitImage) {
            alert('请先选择要分割的图集');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imageWidth = this.splitImage.width;
        const imageHeight = this.splitImage.height;
        
        // 计算单个精灵的大小
        const spriteWidth = Math.floor((imageWidth - (gridSize - 1) * padding) / gridSize);
        const spriteHeight = Math.floor((imageHeight - (gridSize - 1) * padding) / gridSize);

        this.splitSprites = [];
        const splitGrid = document.getElementById('split-grid');
        splitGrid.innerHTML = '';
        splitGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = col * (spriteWidth + padding);
                const y = row * (spriteHeight + padding);

                // 创建单个精灵的画布
                canvas.width = spriteWidth;
                canvas.height = spriteHeight;
                ctx.clearRect(0, 0, spriteWidth, spriteHeight);
                
                // 从原图中提取精灵
                ctx.drawImage(
                    this.splitImage,
                    x, y, spriteWidth, spriteHeight,
                    0, 0, spriteWidth, spriteHeight
                );

                const spriteDataURL = canvas.toDataURL('image/png');
                const index = row * gridSize + col;
                
                this.splitSprites.push({
                    dataURL: spriteDataURL,
                    name: `sprite_${index.toString().padStart(2, '0')}.png`
                });

                // 创建预览元素
                const splitItem = document.createElement('div');
                splitItem.className = 'split-item';

                const img = document.createElement('img');
                img.src = spriteDataURL;
                img.style.width = '80px';
                img.style.height = '80px';

                const indexDiv = document.createElement('div');
                indexDiv.className = 'index';
                indexDiv.textContent = `${index}`;

                splitItem.appendChild(img);
                splitItem.appendChild(indexDiv);
                splitGrid.appendChild(splitItem);
            }
        }

        document.getElementById('split-preview').style.display = 'block';
    }

    downloadAtlas() {
        const canvas = document.getElementById('pack-canvas');
        const link = document.createElement('a');
        link.download = 'atlas.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    downloadJSON() {
        if (!this.atlasData) {
            alert('请先生成图集');
            return;
        }

        const dataStr = JSON.stringify(this.atlasData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'atlas.json';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    async downloadSprites() {
        if (this.splitSprites.length === 0) {
            const message = this.currentLanguage === 'zh' ? '请先分割图集' : 'Please split the atlas first';
            alert(message);
            return;
        }

        try {
            const zip = new JSZip();
            
            // 将所有精灵添加到ZIP文件中
            for (const sprite of this.splitSprites) {
                // 将dataURL转换为blob
                const response = await fetch(sprite.dataURL);
                const blob = await response.blob();
                zip.file(sprite.name, blob);
            }

            // 生成ZIP文件并下载
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                streamFiles: true
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'sprites.zip';
            link.click();
            
            // 清理URL对象
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('创建ZIP文件时出错:', error);
            const message = this.currentLanguage === 'zh' 
                ? '创建压缩包时出错，请重试' 
                : 'Error creating zip file, please try again';
            alert(message);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SpriteAtlasTool();
});