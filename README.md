
# Tactical Soccer Board

## Description
The Tactical Soccer Board is a web application that provides an interactive platform for creating and managing soccer tactics. Users can dynamically place players, draw shapes, and add annotations on a soccer field to visualize and plan strategies effectively.

## Features
- **Player Management**: Add and move player tokens on the soccer field.
- **Drawing Tools**: Use various tools to draw lines, arrows, circles, rectangles, and add text annotations.
- **Soccer Ball**: Add and move a soccer ball on the field.
- **Toolbar**: A set of interactive buttons to manage tools, download the board as an image, and toggle fullscreen mode.
- **Responsive Design**: The application adapts to different screen sizes and maintains a user-friendly interface.

## File Structure

tactical-soccer-board/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── app.js
│   ├── field.js
│   ├── players.js
│   └── tools.js
├── assets/
│   └── soccer-ball.svg

`

## How to Run
### Prerequisites
- Ensure you have a modern web browser installed (e.g., Chrome, Firefox, Safari).

### Steps
1. **Clone the Repository**:
    ```sh
    git clone https://github.com/your-username/tactical-soccer-board.git
    ```
2. **Navigate to the Directory**:
    ```sh
    cd tactical-soccer-board
    ```
3. **Open `index.html` in a Web Browser**:
    - You can directly open `index.html` by double-clicking it in your file explorer, or
    - Use a simple HTTP server to serve the files. For example, using Python:
      ```sh
      python -m http.server
      ```
      Then, open a web browser and go to `http://localhost:8000`.

### Optional: Generate Directory Contents File
If you want to generate a contents file for the directory structure (useful for documentation), you can run the provided Python script:
```sh
python done.py /path/to/tactical-soccer-board
```
This will create a `tactical-soccer-board_contents.txt` file with the directory's contents.

## Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
