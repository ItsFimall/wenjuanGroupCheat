// ==UserScript==
// @name         问卷网答题辅助轮椅
// @namespace    https://code.fimall.lol/Fimall/wenjuanGroupCheat
// @version      3.1
// @description  底部双行信息框版本
// @author       Fimall
// @match        https://www.wenjuan.group/s/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建信息框
    const infoBox = document.createElement('div');
    infoBox.style = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 12px 25px;
        border-radius: 8px 8px 0 0;
        font-family: 'Microsoft Yahei', sans-serif;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
        min-width: 300px;
        text-align: center;
        font-size: 14px;
    `;
    infoBox.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 30px;">
            <div class="info-item">
                <div style="color: #00ff00;">✓ 正确</div>
                <div id="wj-correct" style="font-weight: bold;">0</div>
            </div>
            <div class="info-item">
                <div style="color: #ff4444;">✗ 错误</div>
                <div id="wj-error" style="font-weight: bold;">0</div>
            </div>
            <div class="info-item">
                <div style="color: #00ffff;">上题状态</div>
                <div id="wj-last-status" style="font-weight: bold;">—</div>
            </div>
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: #888;">Powered by Fimall</div>
    `;
    document.body.appendChild(infoBox);

    let score = 0.0;

    // 更新信息框
    function updateInfoBox() {
        const errCount = document.querySelectorAll('.err-option').length;
        const rawRightCount = document.querySelectorAll('.right-option').length;
        const actualRight = Math.max(rawRightCount - errCount, 0);

        document.getElementById('wj-correct').textContent = actualRight;
        document.getElementById('wj-error').textContent = errCount;

        const statusElement = document.getElementById('wj-last-status');
        if(score > 0) {
            statusElement.textContent = '正确';
            statusElement.style.color = '#00ff00';
        } else if(score === 0) {
            statusElement.textContent = '错误';
            statusElement.style.color = '#ff4444';
        } else {
            statusElement.textContent = '—';
            statusElement.style.color = '#00ffff';
        }
    }

    // 拦截API请求
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        xhr.addEventListener('load', function() {
            if(xhr.responseURL.includes('/api/rspd/save_page_answers/')) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    const scoreMap = data?.data?.question_score_map;
                    if(scoreMap) {
                        const lastKey = Object.keys(scoreMap).pop();
                        score = scoreMap[lastKey] || 0;
                    }
                } catch(e) {
                    console.error('解析分数失败:', e);
                }
            }
        });
        return xhr;
    };

    // 定时更新
    setInterval(() => {
        updateInfoBox();
    }, 300);

})();
