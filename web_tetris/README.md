# 网页版俄罗斯方块 / Web Tetris

这是一个使用 HTML5 Canvas 和 JavaScript 制作的网页版俄罗斯方块游戏。
This is a web-based Tetris game made with HTML5 Canvas and JavaScript.

## 如何运行 / How to Run

1. 直接在浏览器中打开 `index.html` 文件
   Simply open the `index.html` file in your browser

   或者 / OR

2. 使用本地服务器（推荐）/ Use a local server (recommended):
   - 如果安装了 Python，可以在当前目录运行：
   - If you have Python installed, run in current directory:
     ```
     # Python 3.x
     python -m http.server 8000
     ```
   然后在浏览器中访问 / Then visit in browser:
   ```
   http://localhost:8000
   ```

## 游戏控制 / Game Controls

- ←/→: 左右移动 / Move left/right
- ↑: 旋转 / Rotate
- ↓: 加速下落 / Move down faster
- 空格键 / Space: 立即下落 / Drop instantly
- 回车键 / Enter: 游戏结束时重新开始 / Restart when game over 