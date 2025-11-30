# 🧪 Test Behaviours

An interactive Angular-based internal developer tool for testing and visualizing API request–response behaviors based on a dynamic JSON definition format.

This project is built using **Angular >= 16**, **RxJS**, **ng-behaviours**, and **Bootstrap 5**.

---

## 📦 Project Structure

This workspace consists of two main internal libraries:


---

## 🚀 Features

- 📑 Dynamic request viewer (similar to Postman)
- ⚙️ Behavior loaded from backend (`/behaviours`)
- 📬 Supports query/header/body parameters
- 🧾 Displays simulated response structure
- 📤 Exports full Postman collections
- 🟢 Built with Angular Signals for reactivity

---

## 📂 Folder Highlights

### `test-behaviours-core`
- `models/` – Interfaces for requests/responses
- `services/data-services/` – Loads and parses behavior config
- `services/export-services/` – Generates Postman-compatible JSON

### `test-behaviours-ui/common`
- `components/` – UI elements (`form-pane`, `side-menu`, etc.)
- `pipe/`, `directives/`, `services/` – Shared UI logic

---

## 🧑‍💻 Getting Started

### 📥 Install dependencies

```bash
npm install
